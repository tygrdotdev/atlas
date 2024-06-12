import { EmbedBuilder, Message, User } from "discord.js";
import { KazagumoPlayer, KazagumoTrack } from "kazagumo";
import { formatDuration } from "../lib/utils";
import progressBar from "../lib/progress-bar";

export function nowPlayingEmbed(player: KazagumoPlayer, track: KazagumoTrack) {
	const embed = new EmbedBuilder()
		.setTitle("Now Playing: **" + track.title + "**");

	if (typeof track.uri !== "undefined") embed.setURL(track.uri);

	if (track.length) {
		// Update the progress bar on the embed
		const currentInSeconds = Math.floor(player.position / 1000);
		const totalInSeconds = Math.floor(track.length / 1000);

		const currentDuration = formatDuration(player.position);
		const totalDuration = formatDuration(track.length);

		embed.setDescription(`\`[${currentDuration}]\` ${progressBar(totalInSeconds, currentInSeconds)[0]} \`[${totalDuration}]\``);
	}

	return embed;
}

export async function updateLiveMsg(player: KazagumoPlayer, message: Message<boolean>, track: KazagumoTrack) {
	const prevMsg: Message<true> | undefined = player.data.get("message");

	if (typeof prevMsg !== "undefined") {
		if (prevMsg.deletable) await prevMsg.delete();
	}

	player.data.set("message", message);

	const interval = setInterval(() => {
		const embed = nowPlayingEmbed(player, track);
		message.edit({ embeds: [embed] });
	}, 5000);

	player.data.set("interval", interval);

	return { message, interval };
}
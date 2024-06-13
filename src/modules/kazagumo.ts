import { EmbedBuilder, Message, User } from "discord.js";
import { KazagumoPlayer, KazagumoTrack } from "kazagumo";
import { formatDuration } from "../lib/utils";
import progressBar from "../lib/progress-bar";

// Fetch a embed with now-playing defaults applied
export function fetchNowPlayingEmbed(player: KazagumoPlayer, track: KazagumoTrack) {
	const embed = new EmbedBuilder()
		.setTitle("Now Playing: **" + track.title + "**");

	if (typeof track.uri !== "undefined") embed.setURL(track.uri);

	return embed;
}

export function fetchProgressBar(player: KazagumoPlayer, track: KazagumoTrack) {
	if (track.length) {
		// Update the progress bar on the embed
		const currentInSeconds = Math.floor(player.position / 1000);
		const totalInSeconds = Math.floor(track.length / 1000);

		const currentDuration = formatDuration(player.position);
		const totalDuration = formatDuration(track.length);

		return `\`[${currentDuration}]\` ${progressBar(totalInSeconds, currentInSeconds)[0]} \`[${totalDuration}]\``
	}
}

export function fetchFormattedQueue(player: KazagumoPlayer, limit: number = 5) {
	const e = player.queue.map((track, i) => {
		const req = track.requester as User;
		return `**#${i + 1}** - ${track.title} (requested by: ${req.username})`
	}).slice(0, limit).join("\n");

	return e;
}

export function updateEmbed(player: KazagumoPlayer, track: KazagumoTrack, msg: Message<boolean>, embed: EmbedBuilder) {
	const queue = fetchFormattedQueue(player, 5);
	const progress = fetchProgressBar(player, track);

	if (typeof progress !== "undefined") {
		embed.setDescription(progress + "\n\n");
	}

	if (queue.length >= 1) {
		embed.setDescription(embed.data.description + "Up next:\n" + queue)
	}

	msg.edit({ embeds: [embed] });
}
import { DiscordCommand } from "../../types/command";
import { nowPlayingEmbed, updateLiveMsg } from "../../modules/kazagumo";

export const command: DiscordCommand = {
	name: "now-playing",
	description: "Returns the current track information.",
	category: "music",
	aliases: ["np"],
	cmd: async (client, msg) => {
		let player = client.kazagumo.getPlayer(msg.guild?.id as string);

		if (!player) return msg.channel.send("There is nothing playing.")

		if (!msg.member?.voice.channelId) return msg.channel.send("You are not in a voice channel.")
		if (msg.member.voice.channelId !== player.voiceId) return msg.channel.send("You are not in the same voice channel as me!");

		if (!player.queue.current) return msg.channel.send("There is nothing playing.");

		const track = player.queue.current;

		const embed = nowPlayingEmbed(player, track);

		msg.channel.send({ embeds: [embed] }).then(async (x) => {
			await updateLiveMsg(player, x, track);
		});
	}
}
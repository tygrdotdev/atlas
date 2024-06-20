import { formatDuration } from "../../lib/utils";
import { DiscordCommand } from "../../types/command";

export const command: DiscordCommand = {
	name: "seek",
	description: "Seek through the currently playing track.",
	category: "music",
	aliases: [],
	usage: "(seconds)",
	cmd: async (client, msg, args) => {
		let player = client.kazagumo.getPlayer(msg.guild?.id as string);

		if (!player) return msg.channel.send("There is no player.");
		if (!player.queue.current) return msg.channel.send("There is nothing playing!");

		if (!msg.member?.voice.channelId) return msg.channel.send("You are not in a voice channel.")
		if (msg.member.voice.channelId !== player.voiceId) return msg.channel.send("You are not in the same voice channel as me!");

		if (!args[0]) return msg.channel.send(`Please specify how many seconds you would like to seek. Example: \`${client.prefix}seek 30\``);

		const ms = parseInt(args[0]) * 1000;

		await player.seek(ms);

		return msg.channel.send(`Seeked the current track to: \`${formatDuration(ms)}\``);
	}
}
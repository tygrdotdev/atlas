import { DiscordCommand } from "../../types/command";

export const command: DiscordCommand = {
	name: "volume",
	description: "Set the music volume.",
	category: "music",
	aliases: ["vol"],
	cmd: async (client, msg, args) => {
		if (!args[0]) return msg.channel.send(`Please provide a new volume to set. For example: \`${client.prefix}volume 35\``);

		let player = client.kazagumo.getPlayer(msg.guild?.id as string);

		if (!player) return msg.channel.send("There is nothing playing.")

		if (!msg.member?.voice.channelId) return msg.channel.send("You are not in a voice channel.")
		if (msg.member.voice.channelId !== player.voiceId) return msg.channel.send("You are not in the same voice channel as me!");

		const volume = parseInt(args[0]);

		player.setVolume(volume);

		return msg.channel.send(`Set the volume to \`${volume}\`.`);
	}
}
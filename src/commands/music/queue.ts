import { EmbedBuilder, User } from "discord.js";
import { DiscordCommand } from "../../types/command";
export const command: DiscordCommand = {
	name: "queue",
	description: "Get the current track queue.",
	category: "music",
	aliases: ["np", "nowplaying"],
	cmd: (client, msg) => {
		let player = client.kazagumo.getPlayer(msg.guild?.id as string);

		if (!player) return msg.channel.send("There is nothing playing.")

		if (!msg.member?.voice.channelId) return msg.channel.send("You are not in a voice channel.")
		if (msg.member.voice.channelId !== player.voiceId) return msg.channel.send("You are not in the same voice channel as me!");

		if (!player.queue.current) return msg.channel.send("The queue is empty.");
		const req = player.queue.current.requester as User;
		const embed = new EmbedBuilder()
			.setTitle(`Now Playing: ${player.queue.current.title}`)
			.setURL(player.queue.current.uri ?? "")
			.setDescription(`Requested by: **${req.username}**`)

		if (player.queue.length >= 1) {
			// Loop through tracks and add them
		} else {
			embed.setDescription("The queue is empty.")
		}

		return msg.channel.send({ embeds: [embed] }).then((msg) => {
			player.data.set("message", msg);
		});
	}
}
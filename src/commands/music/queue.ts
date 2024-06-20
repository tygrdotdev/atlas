import { EmbedBuilder, User } from "discord.js";
import { DiscordCommand } from "../../types/command";

export const command: DiscordCommand = {
	name: "queue",
	description: "Get the current track queue.",
	category: "music",
	aliases: ["q"],
	usage: "",
	cmd: (client, msg) => {
		let player = client.kazagumo.getPlayer(msg.guild?.id as string);

		if (!player) return msg.channel.send("There is nothing playing.")

		if (!msg.member?.voice.channelId) return msg.channel.send("You are not in a voice channel.")
		if (msg.member.voice.channelId !== player.voiceId) return msg.channel.send("You are not in the same voice channel as me!");

		if (!player.queue.current) return msg.channel.send("The queue is empty.");

		const embed = new EmbedBuilder().setTitle(`Now Playing: ${player.queue.current.title} by ${player.queue.current.author}`);

		if (player.queue.current.uri) {
			embed.setURL(player.queue.current.uri);
		}

		if (player.queue.length >= 1) {
			embed.setDescription(
				player.queue.map((track, i) => {
					const req = track.requester as User;
					return `**#${i + 1}** - ${track.title} (requested by: ${req.username})`
				}).slice(0, 10).join("\n")
			);
		} else {
			embed.setDescription(`So empty! Add songs using the \`${client.prefix}play\` command.`);
		}

		if (player.queue.length > 10) {
			embed.setFooter({ text: `And ${player.queue.length - 10} other songs...` });
		}

		return msg.channel.send({ embeds: [embed] });
	}
}
import { EmbedBuilder } from "discord.js";
import { DiscordCommand } from "../../types/command";

export const command: DiscordCommand = {
	name: "user",
	description: "Displays a users info.",
	category: "core",
	aliases: ["whoami"],
	usage: "[id]",
	cmd: (client, msg, args) => {
		const user = msg.mentions.users.first() || client.users.cache.get(args[0]) || msg.author;

		const embed = new EmbedBuilder()
			.setThumbnail(user.displayAvatarURL({ size: 512 }))
			.setColor(user.hexAccentColor ?? "#81a1c2")
			.setTitle(`${user.tag}`)
			.setDescription(`
				**ID:** ${user.id}	
				**Joined ${msg.guild.name}:** ${msg.guild.members.cache.get(user.id)?.joinedAt?.toDateString() ?? "N/A"}
				**Joined Discord:** ${user.createdAt.toDateString()}
				`);

		msg.channel.send({ embeds: [embed] });
	}
}
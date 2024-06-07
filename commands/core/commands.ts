import { Collection, EmbedBuilder, MessageCollector, channelLink } from "discord.js";
import type { DiscordCommand } from "../../types/command";

export const command: DiscordCommand = {
	name: "commands",
	description: "Display all avalible commands.",
	category: "Core",
	cmd: (client, msg, args) => {

		function sendAllCommands() {
			const embed = new EmbedBuilder()
				.setTitle("All Commands")
				.setFooter({ text: `Use "${client.prefix}commands [command]" to find more information aout a specific command.` });

			const core = client.commands.filter(x => x.category === "Core").map((x) => `\`${x.name}\``).join(", ");
			core.length >= 1 ? embed.addFields({ name: "Core", value: core }) : null;

			msg.channel.send({ embeds: [embed] });
		}

		function sendOneResult(cmd: DiscordCommand) {
			const embed = new EmbedBuilder()
				.setTitle(cmd.name)
				.setFields([
					{ name: "Description", value: cmd.description },
					{ name: "Category", value: cmd.category },
				]);

			msg.channel.send({ embeds: [embed] });
		}

		function sendAllResults(commands: Collection<string, DiscordCommand>) {
			let num = 0;

			const embed = new EmbedBuilder()
				.setTitle("Which command would you like to view?")
				.setDescription(commands.map((command) => `${num++}. \`${command.name} [${command.category}]\``).join("\n"))
				.setFooter({ text: "Please respond with your query within 10 seconds." })

			msg.channel.send({ embeds: [embed] });
		}

		if (args[0]) {
			const commands = client.commands.filter(commands => commands.name.includes(args[0]));

			if (commands.size > 1) {
				// If the query has more than one result
				sendAllResults(commands);

			} else {
				// If the query has 1 or less results
				const cmd = commands.get(args[0]);

				if (cmd) {
					// Result found
					sendOneResult(cmd);
				} else {
					// No result found
					msg.channel.send("No results found.");
				}
			}
		} else {
			// If there is no query
			sendAllCommands();
		}
	}
}
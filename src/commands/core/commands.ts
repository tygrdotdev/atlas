import { Collection, EmbedBuilder, MessageCollector } from "discord.js";
import type { DiscordCommand } from "../../types/command";
import { numberRegex } from "../../lib/utils";

export const command: DiscordCommand = {
	name: "commands",
	description: "Display all avalible commands.",
	category: "core",
	aliases: ["cmds"],
	usage: "[command]",
	cmd: (client, msg, args) => {
		function sendAllCommands() {
			const embed = new EmbedBuilder()
				.setTitle("All Commands")
				.setFooter({ text: `Use "${client.prefix}commands [command]" to find more information aout a specific command.` });

			const core = client.commands.filter(x => x.category.toLowerCase() === "core").map((x) => `\`${x.name}\``).join(", ");
			core.length >= 1 ? embed.addFields({ name: "Core", value: core }) : null;

			const music = client.commands.filter(x => x.category.toLowerCase() === "music").map((x) => `\`${x.name}\``).join(", ");
			music.length >= 1 ? embed.addFields({ name: "Music", value: music }) : null;

			const utility = client.commands.filter(x => x.category.toLowerCase() === "utility").map((x) => `\`${x.name}\``).join(", ");
			utility.length >= 1 ? embed.addFields({ name: "Utility", value: utility }) : null;

			msg.channel.send({ embeds: [embed] });
		}

		function sendOneResult(cmd: DiscordCommand) {
			const embed = new EmbedBuilder()
				.setTitle(cmd.name)
				.setFields([
					{ name: "Description", value: cmd.description },
					{ name: "Category", value: cmd.category },
					{ name: "Usage", value: `\`${client.prefix}${cmd.name}${cmd.usage.length >= 1 ? " " + cmd.usage : ""}\`` }
				]);

			cmd.aliases.length >= 1 ? embed.addFields({ name: "Alias(s)", value: cmd.aliases.length > 1 ? cmd.aliases.join(", ") : cmd.aliases[0] }) : null;

			return embed;
		}

		async function sendAllResults(commands: Collection<string, DiscordCommand>) {
			let num = 0;

			const embed = new EmbedBuilder()
				.setTitle("Which command would you like to view?")
				.setDescription(commands.map((command) => `${num++}. \`${command.name} [${command.category}]\``).join("\n"))
				.setFooter({ text: "Please respond with your query within 10 seconds." });

			const queryMsg = await msg.channel.send({ embeds: [embed] });

			const collector = new MessageCollector(msg.channel, { time: 30000, filter: (m => msg.author.id === m.author.id) });

			collector.on("collect", async (m) => {
				const isNumber = numberRegex.test(m.content);

				if (isNumber === false) {
					if (m.deletable) await m.delete();
					queryMsg.edit({ embeds: [], content: "Invalid response. Please try again." });
					collector.stop();
					return;
				}

				const selection = parseInt(m.content) - 1;

				if (m.deletable) await m.delete();

				const cmd = commands.at(selection);

				if (!cmd) {
					queryMsg.edit({ embeds: [], content: "Failed to find command. Please try again." });
					collector.stop();
					return;
				}

				const embed = sendOneResult(cmd);

				await queryMsg.edit({ embeds: [embed] });
				collector.stop();
				return;
			});
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
					const embed = sendOneResult(cmd);
					return msg.channel.send({ embeds: [embed] })
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
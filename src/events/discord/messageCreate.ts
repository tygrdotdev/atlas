import type { DiscordCommand } from "../../types/command";
import type { DiscordEvent } from "../../types/event";

export const event: DiscordEvent<"messageCreate"> = {
	name: "messageCreate",
	cmd: (client, message) => {
		const mention = /^<@!?(\d{17,19})>/.exec(message.content);
		if (mention && mention[1] === client.user?.id) {
			message.reply(`I'm currently listening for \`${client.prefix}\`.`);
		}

		if (message.author.bot || !message.guild || !message.content.startsWith(client.prefix)) return;

		const args = message.content.slice(client.prefix.length).trim().split(/ +/g);
		const cmd = args.shift()?.toLowerCase();
		if (!cmd) return;

		const command: DiscordCommand | undefined = client.commands.get(cmd) || client.aliases.get(cmd);

		if (command) {
			command.cmd(client, message, args);
		}
	}
}
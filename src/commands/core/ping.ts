import type { DiscordCommand } from "../../types/command";

export const command: DiscordCommand = {
	name: "ping",
	description: "Ping the bot.",
	category: "core",
	aliases: [],
	usage: "",
	cmd: (client, msg) => {
		msg.channel.send("Estimating...").then(message => {
			message.edit(`Ping! \`${message.createdTimestamp - msg.createdTimestamp}ms\``)
		});
	}
}
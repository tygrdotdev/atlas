import type { DiscordCommand } from "../../types/command";

export const command: DiscordCommand = {
	name: "ping",
	description: "Ping the bot.",
	category: "core",
	aliases: [],
	cmd: (client, msg) => {
		const start = new Date();
		msg.channel.send("Estimating...").then((msg) => {
			msg.edit(`Ping! \`${new Date().getMilliseconds() - start.getMilliseconds()}ms\``)
		})
	}
}
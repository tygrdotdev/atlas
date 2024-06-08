import type { DiscordCommand } from "../../types/command";

export const command: DiscordCommand = {
	name: "ping",
	description: "Ping the bot.",
	category: "core",
	aliases: [],
	cmd: (_client, message) => {
		message.channel.send("Pong!");
	}
}
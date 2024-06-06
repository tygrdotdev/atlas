import type { DiscordCommand } from "../types/command";

export const command: DiscordCommand = {
	name: "ping",
	description: "Ping the bot.",
	cmd: (client, message) => {
		message.channel.send("Pong!");
	}
}
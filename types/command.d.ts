import type { Client, Message } from "discord.js";

interface CMD {
	(
		client: Client,
		message: Message,
		args: string[]
	): void
}

export interface DiscordCommand {
	name: string;
	description: string;
	cmd: CMD
}
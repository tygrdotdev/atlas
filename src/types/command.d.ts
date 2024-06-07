import type { Message } from "discord.js";
import type VEGA from "../modules/client";

interface CMD {
	(
		client: VEGA,
		message: Message,
		args: string[]
	): void
}

export interface DiscordCommand {
	name: string;
	description: string;
	category: string;
	cmd: CMD
}
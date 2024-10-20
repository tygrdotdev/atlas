import type { Message } from "discord.js";
import Atlas from "../modules/client";

interface CMD {
	(
		client: Atlas,
		message: Message<true>,
		args: string[]
	): void
}

export interface DiscordCommand {
	name: string;
	description: string;
	category: string;
	aliases: string[];
	usage: string;
	cmd: CMD
}
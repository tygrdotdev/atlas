import { Client, Collection, Events } from "discord.js";

import type { DiscordCommand } from "../types/command";
import type { DiscordEvent } from "../types/event";

import { readdirSync } from "fs";
import path from "path";

class VEGA extends Client {
	public commands: Collection<string, DiscordCommand> = new Collection();
	public events: Collection<string, DiscordEvent<never>> = new Collection();

	public async start() {
		// Event Handler
		const eventsPath = path.join(__dirname, "..", "events");

		readdirSync(eventsPath).filter((file) => file.endsWith(".ts")).forEach(async (file) => {
			const { event }: { event: DiscordEvent<never> } = await import(`${eventsPath}/${file}`);
			this.events.set(event.name, event);
			this.on(event.name, event.cmd.bind(null, this));
			console.log(`Successfully loaded ${event.name} event.`)
		});

		// Commands Handler
		const commandsPath = path.join(__dirname, "..", "commands");

		readdirSync(commandsPath).filter((file) => file.endsWith(".ts")).forEach(async (file) => {
			const { command }: { command: DiscordCommand } = await import(`${commandsPath}/${file}`);
			this.commands.set(command.name, command);
			console.log(`Successfully loaded ${command.name} command.`)
		});

		await this.login(Bun.env.DISCORD_TOKEN as string);
	}
}

export default VEGA;
import { Client, Collection } from "discord.js";

import type { DiscordCommand } from "../types/command";
import type { DiscordEvent } from "../types/event";

import { readdirSync } from "fs";
import path from "path";

import { Connectors } from "shoukaku";
import { Kazagumo, Plugins } from "kazagumo";

import Spotify from "kazagumo-spotify"
import Apple from "kazagumo-apple";
import KazagumoFilter from "kazagumo-filter";
import stringToBoolean from "../lib/string-to-bool";
import { ShoukakuEvent } from "../types/shoukaku";
import { KazagumoEvent } from "../types/kazagumo";
import { Log } from "./log";

class Atlas extends Client {
	public commands: Collection<string, DiscordCommand> = new Collection();
	public aliases: Collection<string, DiscordCommand> = new Collection();
	public events: Collection<string, DiscordEvent<never>> = new Collection();
	public prefix: string = process.env.PREFIX as string ?? ">";
	public log: {
		bot: Log,
		shoukaku: Log,
		kazagumo: Log,
		command: Log
	} = {
			bot: new Log("BOT"),
			shoukaku: new Log("SHOUKAKU"),
			kazagumo: new Log("KAZAGUMO"),
			command: new Log("COMMAND")
		}

	public kazagumo: Kazagumo = new Kazagumo({
		defaultSearchEngine: "youtube",
		send: (guildId, payload) => {
			const guild = this.guilds.cache.get(guildId);
			if (guild) guild.shard.send(payload);
		},
		plugins: [
			new Spotify({
				clientId: process.env.SPOTIFY_CLIENT_ID as string,
				clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string,
			}),
			new Apple({
				countryCode: "us",
				imageWidth: 600,
				imageHeight: 900
			}),
			new KazagumoFilter(),
			new Plugins.PlayerMoved(this)
		]
	}, new Connectors.DiscordJS(this), [process.env.NODE_ENV === "development" ? {
		// https://lavalink.darrennathanael.com/SSL/lavalink-with-ssl/#hosted-by-ajiedev
		name: "lava-v4.ajieblogs.eu.org",
		url: "lava-v4.ajieblogs.eu.org:443",
		auth: "https://dsc.gg/ajidevserver",
		secure: true
	} : {
		name: process.env.LAVALINK_NAME as string,
		url: process.env.LAVALINK_HOST as string + ":" + process.env.LAVALINK_PORT as string,
		auth: process.env.LAVALINK_PASSWORD as string,
			secure: stringToBoolean(process.env.LAVALINK_SECURE as string ?? "false")
	}]);

	public async loadCommands() {
		// Commands Handler
		const commandsPath = path.join(__dirname, "..", "commands");

		readdirSync(commandsPath).forEach(async (dir) => {
			const commands = readdirSync(`${commandsPath}/${dir}`).filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

			for (const file of commands) {
				const { command }: { command: DiscordCommand } = await import(`${commandsPath}/${dir}/${file}`);
				this.commands.set(command.name, command);
				if (command.aliases && command.aliases.length > 0) {
					for (const alias of command.aliases) {
						this.aliases.set(alias, command);
					}

					this.log.bot.info(`Loaded command: ${command.name} [${command.aliases.join(", ")}]`);
				} else {
					this.log.bot.info(`Loaded command: ${command.name}`)
				}
			}
		});

		return true;
	}

	public async loadEvents() {
		// Discord Event Handler
		const eventsPath = path.join(__dirname, "..", "events", "discord");

		readdirSync(eventsPath).filter((file) => file.endsWith(".ts") || file.endsWith(".js")).forEach(async (file) => {
			const { event }: { event: DiscordEvent<never> } = await import(`${eventsPath}/${file}`);
			this.events.set(event.name, event);
			this.on(event.name, event.cmd.bind(null, this));
			this.log.bot.info(`Loaded event: ${event.name}`)
		});

		return true;
	}

	public async loadShoukakuEvents() {
		// Shoukaku Event Handler
		const eventsPath = path.join(__dirname, "..", "events", "shoukaku");

		readdirSync(eventsPath).filter((file) => file.endsWith(".ts") || file.endsWith(".js")).forEach(async (file) => {
			const { event }: { event: ShoukakuEvent<any> } = await import(`${eventsPath}/${file}`);
			this.kazagumo.shoukaku.on(event.name, event.cmd.bind(null, this));
			this.log.shoukaku.info(`Loaded event: ${event.name}`)
		});

		return true;
	}


	public async loadKazagumoEvents() {
		// Shoukaku Event Handler
		const eventsPath = path.join(__dirname, "..", "events", "kazagumo");

		readdirSync(eventsPath).filter((file) => file.endsWith(".ts") || file.endsWith(".js")).forEach(async (file) => {
			const { event }: { event: KazagumoEvent<any> } = await import(`${eventsPath}/${file}`);
			this.kazagumo.on(event.name, event.cmd.bind(null, this));
			this.log.kazagumo.info(`Loaded event: ${event.name}`)
		});

		return true;
	}	

	public async start() {
		const pkg = await import(`../../package.json`);
		console.clear();

		pkg ? this.log.bot.info(`Starting Atlas v${pkg.version}\n`) : this.log.bot.info(`Starting Atlas\n`);

		// Music
		await this.loadShoukakuEvents();
		await this.loadKazagumoEvents();

		// Discord Bot
		await this.loadCommands();
		await this.loadEvents();

		// Start Bot
		this.login(process.env.DISCORD_TOKEN as string).catch((err) => {
			return this.log.bot.error(err);
		});
	}

	public async restart() {
		this.log.bot.warn("Reloading commands and events. The bot might crash!", false);
		// Clear all commands and events
		this.commands.clear();
		this.events.clear();

		this.removeAllListeners();

		// Load all commands and events
		this.loadCommands();
		this.loadEvents();

		return true;
	}
}

export default Atlas;
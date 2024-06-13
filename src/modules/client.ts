import { ActivityType, ChannelType, Client, Collection, EmbedBuilder, Message, User } from "discord.js";

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
import { fetchFormattedQueue, fetchNowPlayingEmbed, fetchProgressBar, updateEmbed } from "./kazagumo";

class Atlas extends Client {
	public commands: Collection<string, DiscordCommand> = new Collection();
	public aliases: Collection<string, DiscordCommand> = new Collection();
	public events: Collection<string, DiscordEvent<never>> = new Collection();
	public prefix: string = process.env.PREFIX as string ?? ">";
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

					console.log(`Successfully loaded command: ${command.name} [${command.aliases.join(", ")}]`);
				} else {
					console.log(`Successfully loaded command: ${command.name}`)
				}
			}
		});

		return true;
	}

	public async loadEvents() {
		// Discord Event Handler
		const eventsPath = path.join(__dirname, "..", "events");

		readdirSync(eventsPath).filter((file) => file.endsWith(".ts") || file.endsWith(".js")).forEach(async (file) => {
			const { event }: { event: DiscordEvent<never> } = await import(`${eventsPath}/${file}`);
			this.events.set(event.name, event);
			this.on(event.name, event.cmd.bind(null, this));
			console.log(`Successfully loaded event: ${event.name}`)
		});

		return true;
	}

	public async loadMusicEvents() {
		// Music events
		this.kazagumo.shoukaku.on('ready', () => console.log(`Connected to LavaLink server!`));
		this.kazagumo.shoukaku.on('error', (name, error) => console.error(`Lavalink ${name}: Error Caught,`, error));
		this.kazagumo.shoukaku.on('close', (name, code, reason) => console.warn(`Lavalink ${name}: Closed, Code ${code}, Reason ${reason || 'No reason'}`));
		this.kazagumo.shoukaku.on('disconnect', (name) => {
			const players = [...this.kazagumo.shoukaku.players.values()].filter(p => p.node.name === name);
			players.map(player => {
				this.kazagumo.destroyPlayer(player.guildId);
				player.destroy();
			});
			console.warn(`Lavalink ${name}: Disconnected`);
		});

		if (process.env.NODE_ENV === "development") {
			// this.kazagumo.shoukaku.on('debug', (name, info) => console.debug(info));
		}

		// Player events
		this.kazagumo.on("playerStart", (player, track) => {
			// Set Bot activity to new track
			this.user?.setActivity({ name: track.title, type: ActivityType.Listening });

			// Stop interval from last song
			const interval = player.data.get("interval") as NodeJS.Timeout;

			if (typeof interval !== "undefined") {
				clearTimeout(interval);
			}

			// Fetch the channel the player has cached
			const channel = this.channels.cache.get(player.textId as string);
			if (!channel) return;

			// Fetch a fresh embed
			const embed = fetchNowPlayingEmbed(player, track);

			// Get Progress
			const progress = fetchProgressBar(player, track);

			// Get the next 5 songs in the queue
			const queue = fetchFormattedQueue(player, 5);

			if (typeof progress !== "undefined") {
				embed.setDescription(progress + "\n\n");
			}

			if (queue.length >= 1) {
				embed.setDescription(embed.data.description + "Up next:\n" + queue)
			}

			// Fetch existing message
			const existingMessage: Message | undefined = player.data.get("message");

			// Check if the message exists
			if (typeof existingMessage !== "undefined") {
				// If so, edit the message
				return existingMessage.edit({ embeds: [embed] }).then(async (x) => {
					const interval = setInterval(() => {
						updateEmbed(player, track, existingMessage, embed);
					}, 3000);

					player.data.set("interval", interval);
					player.data.set("message", x);
				});
			} else {
				if (channel.type === ChannelType.GuildText) {
				// If not, create a new message
					return channel.send({ embeds: [embed] }).then(async x => {
						const interval = setInterval(() => {
							updateEmbed(player, track, x, embed);
						}, 3000);

						player.data.set("interval", interval);
						player.data.set("message", x);
					});
				}
			}
		});

		this.kazagumo.on("playerEmpty", player => {
			const channel = this.channels.cache.get(player.textId as string);
			if (!channel) return;

			if (channel.type === ChannelType.GuildText) {
				const embed = new EmbedBuilder()
					.setDescription("The queue has ended")
				player.data.get("message")?.edit({ embeds: [embed] });
			}

			const interval: ReturnType<typeof setInterval> = player.data.get("interval");
			if (!interval) return player.destroy();

			clearInterval(interval);

			player.destroy();
		});

		return true;
	}

	public async start() {
		const pkg = await import(`../../package.json`);
		console.clear();

		pkg ? console.log(`Starting Atlas v${pkg.version}\n`) : console.log(`Starting Atlas\n`);

		await this.loadCommands();
		await this.loadEvents();
		await this.loadMusicEvents();

		this.login(process.env.DISCORD_TOKEN as string).catch((err) => {
			return console.error(err);
		});
	}

	public async restart() {
		console.log("\nReloading...\n")
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
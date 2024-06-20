import { DiscordCommand } from "../../types/command";
import { fetchFormattedQueue, fetchNowPlayingEmbed, fetchProgressBar, updateEmbed } from "../../modules/kazagumo";
import { ActivityType, ChannelType, Message, User } from "discord.js";

export const command: DiscordCommand = {
	name: "nowplaying",
	description: "Returns the current track information.",
	category: "music",
	aliases: ["np"],
	usage: "",
	cmd: async (client, msg) => {
		let player = client.kazagumo.getPlayer(msg.guild?.id as string);

		if (!player) return msg.channel.send("There is nothing playing.")

		if (!msg.member?.voice.channelId) return msg.channel.send("You are not in a voice channel.")
		if (msg.member.voice.channelId !== player.voiceId) return msg.channel.send("You are not in the same voice channel as me!");

		if (!player.queue.current) return msg.channel.send("There is nothing playing.");

		// Currently playing track
		const track = player.queue.current;

		client.user?.setActivity({ name: track.title, type: ActivityType.Listening });

		// Stop interval from last song
		const interval = player.data.get("interval") as NodeJS.Timeout;

		if (typeof interval !== "undefined") {
			clearTimeout(interval);
		}

		// Fetch the channel the player has cached
		const channel = client.channels.cache.get(player.textId as string);
		if (!channel) return;

		// Fetch a fresh embed
		const embed = fetchNowPlayingEmbed(player, track);

		// Get Progress
		const progress = fetchProgressBar(player, track);

		// Get the next 5 songs in the queue
		const queue = fetchFormattedQueue(player, 5);

		// If progress, add to desc
		if (typeof progress !== "undefined") {
			embed.setDescription(progress + "\n\n");
		}

		// If 
		if (queue.length >= 1) {
			embed.setDescription(embed.data.description + "Up next:\n" + queue)
		}

		// Fetch existing message
		const existingMessage: Message | undefined = player.data.get("message");

		// Check if the message exists
		if (typeof existingMessage !== "undefined") {
			// If so, delete the old message
			if (existingMessage.deletable) existingMessage.delete();
		}

		if (channel.type === ChannelType.GuildText) {
			// Create a new message
			return channel.send({ embeds: [embed] }).then(async x => {
				const interval = setInterval(() => {
					updateEmbed(player, track, x, embed);
				}, 3000);

				player.data.set("interval", interval);
				player.data.set("message", x);
			});
		}
	}
}
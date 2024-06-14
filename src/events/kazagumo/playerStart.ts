import { ActivityType, ChannelType, Message } from "discord.js";
import { KazagumoEvent } from "../../types/kazagumo";
import { fetchFormattedQueue, fetchNowPlayingEmbed, fetchProgressBar, updateEmbed } from "../../modules/kazagumo";

export const event: KazagumoEvent<"playerStart"> = {
	name: "playerStart",
	cmd(client, player, track) {
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
	},
}
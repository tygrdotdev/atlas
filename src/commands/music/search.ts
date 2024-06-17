import { EmbedBuilder, MessageCollector } from "discord.js";
import { DiscordCommand } from "../../types/command";
import { convertTime } from "../../lib/utils";

export const command: DiscordCommand = {
	name: "search",
	description: "Search the song you're looking to add to the queue.",
	category: "music",
	aliases: [],
	cmd: async (client, msg, args) => {
		if (!msg.member?.voice.channel) return msg.channel.send("You need to be in a voice channel to use this command.");

		if (!args[0]) return msg.channel.send("Please provide a query to search.");

		const query = args.join(" ");

		const results = await client.kazagumo.search(query, { requester: msg.author });

		let num = 1;

		const embed = new EmbedBuilder()
			.setTitle(`Search results for: ${query}`)
			.setDescription(results.tracks.slice(0, 10).map((track) => `**${num++}.** [${track.title}](${track.uri}) (${track.length ? convertTime(track.length) : ""})`).join("\n"))
			.setFooter({ text: "Please reply with the selection you would like to add to the queue." })

		const resultMsg = await msg.channel.send({ embeds: [embed] });

		const collector = new MessageCollector(resultMsg.channel, { max: 1, filter: m => m.author.id === msg.author.id, time: 30000 });

		collector.on("collect", async (reply) => {
			if (reply.content === "cancel") {
				resultMsg.edit({ embeds: [], content: "Search cancelled." });
				return collector.stop();
			}

			if (!/^\d+$/.test(reply.content)) {
				msg.channel.send("An invalid selection was made. Please try again.");
				return collector.stop();
			}

			const selection = parseInt(reply.content) - 1;

			if (selection < 1 || selection > 10) {
				msg.channel.send("An invalid selection was made. Please try again.");
				return collector.stop();
			}

			const player = await client.kazagumo.createPlayer({
				guildId: msg.guild?.id as string,
				textId: msg.channel.id as string,
				voiceId: msg.member!.voice.channel!.id,
				volume: 30
			});

			player.queue.add(results.tracks[selection]);
			if (!player.playing && !player.paused) player.play();

			reply.react("✅");
			return collector.stop();
		});
	}
}
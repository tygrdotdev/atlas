import type { DiscordCommand } from "../../types/command";

export const command: DiscordCommand = {
	name: "play",
	description: "Add a song to the queue.",
	category: "music",
	aliases: ["p"],
	cmd: async (client, msg, args) => {
		if (!msg.member?.voice.channel) return msg.channel.send("You need to be in a voice channel to use this command.");

		if (!args[0]) return msg.channel.send("Please specify a query.");
		const query = args.join(" ");

		const player = await client.kazagumo.createPlayer({
			guildId: msg.guild?.id as string,
			textId: msg.channel.id as string,
			voiceId: msg.member.voice.channel.id,
			volume: 30
		});

		const result = await client.kazagumo.search(query, { requester: msg.author });
		if (!result.tracks.length) return msg.reply("No results found!");

		if (result.type === "PLAYLIST") for (let track of result.tracks) player.queue.add(track);
		else player.queue.add(result.tracks[0]);

		if (!player.playing && !player.paused) player.play();
		return msg.react("✅");
	}
}
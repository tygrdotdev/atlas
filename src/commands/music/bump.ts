import { KazagumoTrack } from "kazagumo";
import { DiscordCommand } from "../../types/command";

export const command: DiscordCommand = {
	name: "bump",
	description: "Bumps the currently playing track down the queue, in favour for a new track.",
	category: "music",
	aliases: ["push"],
	cmd: async (client, msg, args) => {
		if (!msg.member?.voice.channel) return msg.channel.send("You need to be in a voice channel to use this command.");

		if (!args[0]) return msg.channel.send("Please specify a query.");
		const query = args.join(" ");

		let player = client.kazagumo.getPlayer(msg.guildId!);

		if (!player) return msg.channel.send("There is nothing playing.");

		const result = await client.kazagumo.search(query, { requester: msg.author });
		if (!result.tracks.length) return msg.reply("No results found!");

		if (result.type === "PLAYLIST") return msg.channel.send("You can only bump a single track.");

		// Workaround for tracks that are parsed from Spotify.
		const track = new KazagumoTrack(result.tracks[0].getRaw()._raw, msg.author);
		player.play(track);

		if (!player.playing && !player.paused) player.play();
		return msg.channel.send(`Bumped \`${player.queue[0].title}\` down the queue in favour for \`${track.title}\`.`);
	}
}
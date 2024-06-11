import { DiscordCommand } from "../../types/command";

export const command: DiscordCommand = {
	name: "pause",
	description: "Toggle the player's paused state.",
	category: "music",
	aliases: [],
	cmd: (client, msg) => {
		let player = client.kazagumo.getPlayer(msg.guild?.id as string);

		if (!player) return msg.channel.send("There is nothing playing.")

		if (!msg.member?.voice.channelId) return msg.channel.send("You are not in a voice channel.")
		if (msg.member.voice.channelId !== player.voiceId) return msg.channel.send("You are not in the same voice channel as me!");

		if (player.paused) {
			msg.react("▶️");
			return player.pause(false);
		} else {
			msg.react("⏸️")
			return player.pause(true);
		}
	}
}
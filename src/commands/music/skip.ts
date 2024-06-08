import { DiscordCommand } from "../../types/command";

export const command: DiscordCommand = {
	name: "skip",
	description: "Skip the currently playing track.",
	category: "music",
	cmd: (client, msg) => {
		let player = client.kazagumo.getPlayer(msg.guild?.id as string);

		if (!player) return msg.channel.send("There is nothing playing.")

		if (!msg.member?.voice.channelId) return msg.channel.send("You are not in a voice channel.")
		if (msg.member.voice.channelId !== player.voiceId) return msg.channel.send("You are not in the same voice channel as me!");

		player.skip();
		return msg.react("✅");
	}
}
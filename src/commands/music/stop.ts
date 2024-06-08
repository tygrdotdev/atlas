import { DiscordCommand } from "../../types/command";

export const command: DiscordCommand = {
	name: "stop",
	description: "Clears the queue and stops playing.",
	category: "music",
	cmd: (client, msg) => {
		let player = client.kazagumo.getPlayer(msg.guild?.id as string);

		if (!player) return msg.channel.send("There is nothing playing.")

		if (!msg.member?.voice.channelId) return msg.channel.send("You are not in a voice channel.")
		if (msg.member.voice.channelId !== player.voiceId) return msg.channel.send("You are not in the same voice channel as me!");

		player.queue.clear();
		player.destroy();

		return msg.react("👋");
	}
}
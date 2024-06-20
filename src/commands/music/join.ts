import { DiscordCommand } from "../../types/command";

export const command: DiscordCommand = {
	name: "join",
	description: "Create a new empty player.",
	aliases: ["summon"],
	category: "music",
	usage: "",
	cmd: async (client, msg) => {
		let oldPlayer = client.kazagumo.getPlayer(msg.guild?.id as string);

		if (oldPlayer) return msg.channel.send("There is already a player.");

		if (!msg.member?.voice.channel) return msg.channel.send("You need to be in a voice channel to use this command.");

		await client.kazagumo.createPlayer({
			guildId: msg.guild?.id as string,
			textId: msg.channel.id as string,
			voiceId: msg.member.voice.channel.id,
			volume: 30,
			deaf: true
		});

		return msg.channel.send(`Joined! Use the \`${client.prefix}play\` command to add songs to the queue.`)
	}
}
import { Client, Events, GatewayIntentBits } from "discord.js"

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.once(Events.ClientReady, (c) => {
	console.log("Ready! Logged in as", c.user.tag)
});

client.on(Events.MessageCreate, (msg) => {
	if (!msg.content.startsWith(Bun.env.PREFIX as string) || msg.author.bot) return;

	if (msg.content.startsWith(Bun.env.PREFIX as string + "ping")) {
		// Ping Command
		msg.channel.send("?ping");
	}
});

client.login(Bun.env.DISCORD_TOKEN);
import { Client, Events } from "discord.js"

const client = new Client({ intents: [] });

client.once(Events.ClientReady, (c) => {
	console.log("Ready! Logged in as", c.user.tag)
});

client.login(Bun.env.DISCORD_TOKEN);
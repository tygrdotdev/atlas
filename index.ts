import { GatewayIntentBits } from "discord.js";
import VEGA from "./modules/client";

const vega = new VEGA({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
});

vega.start();

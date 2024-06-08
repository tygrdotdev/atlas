import { GatewayIntentBits } from "discord.js";
import Atlas from "./modules/client";

import "dotenv/config"

const atlas = new Atlas({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.GuildMessageReactions
	],
});

atlas.start();
import { GatewayIntentBits } from "discord.js";
import VEGA from "./modules/client";

import 'dotenv/config'

const vega = new VEGA({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildVoiceStates,
	],
});

vega.start();

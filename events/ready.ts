import type { DiscordEvent } from "../types/event";

export const event: DiscordEvent<"ready"> = {
	name: "ready",
	cmd: (c) => {
		console.log(`Ready! Connected to Discord as ${c.user?.tag}`);
	}
}
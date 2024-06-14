import type { DiscordEvent } from "../../types/event";

export const event: DiscordEvent<"ready"> = {
	name: "ready",
	cmd: (c) => {
		c.log.bot.info(`Connected to Discord as ${c.user?.tag}`);
	}
}
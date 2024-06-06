import type { ClientEvents } from "discord.js";
import type VEGA from "../modules/client";

export interface DiscordEvent<T extends keyof ClientEvents> {
	name: T;
	cmd: (client: VEGA, ...args: ClientEvents[T]) => void | PromiseLike<void>;
}
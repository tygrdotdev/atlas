import type { ClientEvents } from "discord.js";
import type Atlas from "../modules/client";

export interface DiscordEvent<T extends keyof ClientEvents> {
	name: T;
	cmd: (client: Atlas, ...args: ClientEvents[T]) => void | PromiseLike<void>;
}
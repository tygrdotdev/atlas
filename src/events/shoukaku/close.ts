import { ShoukakuEvent } from "../../types/shoukaku";

export const event: ShoukakuEvent<"close"> = {
	name: "close",
	cmd: (_client, name, code, reason) => {
		console.warn(`Lavalink ${name} Closed [${code}]: ${reason || 'No reason'}`);
	}
}
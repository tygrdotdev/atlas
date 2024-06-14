import stringToBoolean from "../../lib/string-to-bool";
import { ShoukakuEvent } from "../../types/shoukaku";

export const event: ShoukakuEvent<"debug"> = {
	name: "debug",
	cmd: (client, name, info) => {
		if (stringToBoolean(process.env.DEBUG ?? "false") === true) {
			console.debug(`[LAVALINK-${name}] Debug: ${info}`);
		}
	}
}
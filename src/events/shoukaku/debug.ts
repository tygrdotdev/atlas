import { ShoukakuEvent } from "../../types/shoukaku";

export const event: ShoukakuEvent<"debug"> = {
	name: "debug",
	cmd: (client, name, info) => {
		if (process.env.DEBUG === "1" || process.env.NODE_ENV === "development") {
			client.log.shoukaku.trace(info);
		}
	}
}
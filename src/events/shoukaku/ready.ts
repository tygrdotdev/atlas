import { ShoukakuEvent } from "../../types/shoukaku";

export const event: ShoukakuEvent<"ready"> = {
	name: "ready",
	cmd: (client, name) => {
		client.log.shoukaku.info(`Connected to ${name}`)
	}
}
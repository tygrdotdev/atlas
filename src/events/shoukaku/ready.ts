import { ShoukakuEvent } from "../../types/shoukaku";

export const event: ShoukakuEvent<"ready"> = {
	name: "ready",
	cmd: (c) => {
		c.log.shoukaku.info(`Connected to LavaLink server!`)
	}
}
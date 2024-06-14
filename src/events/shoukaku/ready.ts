import { ShoukakuEvent } from "../../types/shoukaku";

export const event: ShoukakuEvent<"ready"> = {
	name: "ready",
	cmd: () => {
		console.log(`Connected to LavaLink server!`)
	}
}
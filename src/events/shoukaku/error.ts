import { ShoukakuEvent } from "../../types/shoukaku";

export const event: ShoukakuEvent<"error"> = {
	name: "error",
	cmd: (_client, name, error) => {
		console.error(`Lavalink ${name} Error: ${error}`);
	}
}
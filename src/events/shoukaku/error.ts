import { ShoukakuEvent } from "../../types/shoukaku";

export const event: ShoukakuEvent<"error"> = {
	name: "error",
	cmd: (client, name, error) => {
		client.log.shoukaku.error(`Error: ${error}`);
	}
}
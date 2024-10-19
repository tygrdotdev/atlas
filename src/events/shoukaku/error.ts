import { ShoukakuEvent } from "../../types/shoukaku";

export const event: ShoukakuEvent<"error"> = {
	name: "error",
	cmd: (client, name, error) => {
		if (error instanceof AggregateError) {
			error.errors.forEach((e) => {
				client.log.shoukaku.error(`Error: ${e}`);
			})
		}
		client.log.shoukaku.error(`Error: ${error}`);
	}
}
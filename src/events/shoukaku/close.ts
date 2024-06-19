import { ShoukakuEvent } from "../../types/shoukaku";

export const event: ShoukakuEvent<"close"> = {
	name: "close",
	cmd: (client, name, code, reason) => {
		client.log.shoukaku.warn(`Connection lost: ${reason || 'No reason'}`, false);
	}
}
import { ShoukakuEvent } from "../../types/shoukaku";

export const event: ShoukakuEvent<"close"> = {
	name: "close",
	cmd: (client, name, code, reason) => {
		client.log.shoukaku.warn(`Connection lost: ${reason.length >= 1 ? reason : 'No reason'}`, false);
	}
}
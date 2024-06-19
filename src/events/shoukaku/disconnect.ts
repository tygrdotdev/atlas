import { ShoukakuEvent } from "../../types/shoukaku";

export const event: ShoukakuEvent<"disconnect"> = {
	name: "disconnect",
	cmd: (client, name, count) => {
		const players = [...client.kazagumo.shoukaku.players.values()].filter(p => p.node.name === name);
		players.map(player => {
			client.kazagumo.destroyPlayer(player.guildId);
			player.destroy();

			client.log.shoukaku.trace(`Destroyed player: ${player.guildId}`)
		});
		client.log.shoukaku.info(`Disconnected from ${name}`);
	}
}
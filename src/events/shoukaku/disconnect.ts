import { ShoukakuEvent } from "../../types/shoukaku";

export const event: ShoukakuEvent<"disconnect"> = {
	name: "disconnect",
	cmd: (client, name, count) => {
		const players = [...client.kazagumo.shoukaku.players.values()].filter(p => p.node.name === name);
		players.map(player => {
			client.kazagumo.destroyPlayer(player.guildId);
			player.destroy();
		});
		console.warn(`Lavalink ${name}: Disconnected`);
	}
}
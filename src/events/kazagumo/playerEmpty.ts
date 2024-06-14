import { ChannelType, EmbedBuilder } from "discord.js";
import { KazagumoEvent } from "../../types/kazagumo";

export const event: KazagumoEvent<"playerEmpty"> = {
	name: "playerEmpty",
	cmd(client, player) {
		const channel = client.channels.cache.get(player.textId as string);
		if (!channel) return;

		if (channel.type === ChannelType.GuildText) {
			const embed = new EmbedBuilder()
				.setDescription("The queue has ended")
			player.data.get("message")?.edit({ embeds: [embed] });
		}

		const interval: ReturnType<typeof setInterval> = player.data.get("interval");
		if (!interval) {
			player.destroy()
			return;
		}

		clearInterval(interval);

		player.destroy();
	},
}
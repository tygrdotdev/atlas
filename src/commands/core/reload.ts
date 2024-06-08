import { DiscordCommand } from "../../types/command";

export const command: DiscordCommand = {
	name: "reload",
	description: "Reloads the bots commands and events.",
	aliases: ["rl"],
	category: "core",
	cmd: async (client, msg, args) => {
		// Confirmation
		const confirm = await msg.channel.send(`Are you sure? ${client.user?.tag} may become unresponsive during the reload.`);
		await confirm.react("✅");

		// Listen for reaction
		const confirmCollector = confirm.createReactionCollector({ time: 10000 });
		confirmCollector.on("collect", async (r, u) => {
			if (u.id !== msg.author.id) return r.remove();

			if (r.emoji.name === "✅") {
				// Continue with restart
				await confirm.reactions.removeAll();
				await confirm.edit("Reloading...")

				confirmCollector.stop();
				await client.restart().then((res) => {
					if (res === true) {
						confirm.edit(`Successfully reloaded all commands and events.`)
					}
				})

				return;
			} else {
				await confirm.reactions.removeAll();
				await confirm.edit("Reload cancelled.");
				return confirmCollector.stop();
			}
		});
	}
}
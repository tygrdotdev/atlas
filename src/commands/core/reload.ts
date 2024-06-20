import { DiscordCommand } from "../../types/command";

export const command: DiscordCommand = {
	name: "reload",
	description: "Reload bot commands and events. Can specify specific modules: commands, events.",
	aliases: ["rl"],
	category: "core",
	usage: "['commands' | 'events']",
	cmd: async (client, msg, args) => {
		if (typeof process.env.OWNER_ID === "undefined") return msg.channel.send("Please setup a bot owner before using this command. [Need some help?](https://github.com/tygrxqt/atlas/wiki/Setting-up-a-Bot-Owner)")

		const owner = await client.users.fetch(process.env.OWNER_ID);

		if (!owner) return msg.channel.send("I can't find the owner. Please check my permissions and try again.");

		let modules: string[] = [];

		if (args.length >= 1) {
			for (const module of args) {
				if (module === "commands" || module === "cmds") modules.push("commands");
				if (module === "events") modules.push("events");
			}
		}

		if (msg.author.id !== owner.id) return msg.channel.send(`Sorry, I only accept administrator commands from ${owner.username}.`);

		// Confirmation
		const confirm = await msg.channel.send(`Are you sure? I may become unresponsive during the reload.`);
		await confirm.react("✅");

		// Listen for reaction
		const confirmCollector = confirm.createReactionCollector({ time: 10000 });
		confirmCollector.on("collect", async (r, u) => {
			// Don't remove the bot's reaction, tends to clash with line 19
			if (u.id === client.user?.id) return;
			if (u.id !== msg.author.id) return r.remove();

			if (r.emoji.name === "✅") {
				// Continue with reload
				await confirm.reactions.removeAll();
				await confirm.edit("Reloading...")

				confirmCollector.stop();

				await client.restart(modules.length >= 1 ? modules : undefined).then((res) => {
					if (res === true) {
						confirm.edit(`All ${modules.length >= 1 ? modules.join(", ") : "commands and events"} have been reloaded.`);
						return;
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
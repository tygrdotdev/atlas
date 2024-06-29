import { DiscordCommand } from "../../types/command";

export const command: DiscordCommand = {
	name: "update",
	description: "Request a Docker container update via watchtower",
	category: "core",
	aliases: [],
	usage: "",
	cmd: async (client, msg) => {
		if (typeof process.env.OWNER_ID === "undefined") return msg.channel.send("Please setup a bot owner before using this command. [Need some help?](https://github.com/tygrxqt/atlas/wiki/Setting-up-a-Bot-Owner)")

		const owner = await client.users.fetch(process.env.OWNER_ID);

		if (!owner) return msg.channel.send("I can't find the owner. Please check my permissions and try again.");

		if (process.env.NODE_ENV !== "production") {
			return msg.channel.send("You can only run this command in production.");
		}

		const loadingMsg = await msg.channel.send("Updating...");

		fetch(`http://${typeof process.env.WATCHTOWER_NAME === "undefined" ? "watchtower" : process.env.WATCHTOWER_NAME}:8080/v1/update`, {
			headers: {
				"Authorization": `Bearer ${typeof process.env.WATCHTOWER_SECRET === "undefined" ? "atlas" : process.env.WATCHTOWER_SECRET}`
			}
		}).catch(async (err) => {
			console.error(err);
			await loadingMsg.edit(`Failed to trigger update: \`${err.message}\``);
		});

		loadingMsg.edit(`Successfully triggered an update. If there is an update available, ${client.user?.tag} will temporarily go offline during the update process.`);
	}
}
import { DiscordCommand } from "../../types/command";

export const command: DiscordCommand = {
	name: "user",
	description: "Displays a users info.",
	category: "core",
	aliases: ["whoami"],
	usage: "[id]",
	cmd: (client, msg, args) => {

	}
}
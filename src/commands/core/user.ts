import { DiscordCommand } from "../../types/command";

export const command: DiscordCommand = {
	name: "user",
	description: "Displays a users info.",
	category: "core",
	aliases: ["whoami"],
	cmd: (client, msg, args) => {

	}
}
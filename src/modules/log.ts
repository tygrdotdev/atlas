import chalk from "chalk";
import { EmbedBuilder } from "discord.js";

export class Log {
	private module: string;

	constructor(module: string) {
		this.module = module;
	}

	private log(message: string) {

		console.log(
			chalk.gray(`[${this.module.toUpperCase()}]`) + " " + message,
		);
	}

	async error(message: string) {
		this.log(chalk.red("error") + " - " + message);

		const embed = new EmbedBuilder()
			.setColor("#BF616A")
			.setTitle("❌ Something went wrong!")
			.setDescription(message);
		return { embeds: [embed] };
	}

	async warn(message: string, msg: boolean) {
		this.log(chalk.yellow("warn") + " - " + message);

		if (msg) {
			const embed = new EmbedBuilder()
				.setColor("#EBCB8B")
				.setTitle("⚠️ Something went wrong!")
				.setDescription(message);
			return { embeds: [embed] };
		}
	}

	async info(message: string) {
		this.log(chalk.cyan("info") + " - " + message);
	}

	async debug(message: string) {
		if (process.env.DEBUG === "1") this.log(chalk.magenta("debug") + " - " + message);
	}

	async trace(message: string) {
		if (process.env.DEBUG === "1") this.log(chalk.magenta("trace") + " - " + message);
	}
}
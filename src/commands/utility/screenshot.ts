import puppeteer from "puppeteer";
import { DiscordCommand } from "../../types/command";

export const command: DiscordCommand = {
	name: "screenshot",
	description: "Returns a screenshot from a given URL.",
	category: "utility",
	aliases: ["ss"],
	cmd: async (client, msg, args) => {
		if (!args[0]) return msg.channel.send("Please provide a URL to screenshot.");

		const sent = await msg.channel.send("Loading... (This may take a while)");

		const browser = await puppeteer.launch();
		const page = await browser.newPage();

		await page.goto(args[0], { waitUntil: "networkidle2" });

		await page.setViewport({ width: 1920, height: 1080 });
		const ss = await page.screenshot({ type: "jpeg", quality: 100 });

		return sent.edit({ files: [{ attachment: ss, name: "screenshot.png" }], content: "" });
	}
}
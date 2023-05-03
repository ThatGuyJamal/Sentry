import { EmbedBuilder } from "@oceanicjs/builders";
import { ICommand } from "../types.js";

export default {
	trigger: "stats",
	description: "Statistics about the bot and server",
	async run(client, message) {
		const embed = new EmbedBuilder();

		embed.setTitle("Bot Statistics");
		embed.addField(
			"General Information",
			"Sentry is a bot created by the Code Long & Profit Moderation team to help provide moderation through bot automation."
		);
		embed.addField("Watching Over", `${message.guild?.memberCount} users`);
		embed.addField("Watching", `${client.guilds.size} servers`);
		embed.addField("Watching", `${message.guild?.channels.size} channels`);
		embed.setFooter("Sentry Bot Team");

		await message.channel?.createMessage({ embeds: [embed.toJSON()] });
	},
} as ICommand;

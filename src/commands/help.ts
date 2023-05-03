import { ICommand } from "../types.js";
import { EmbedBuilder } from "@oceanicjs/builders";

export default {
	trigger: "help",
	aliases: ["h", "commands"],
	description: "Shows a list of bot commands",
	async run(client, message) {
		const embed = new EmbedBuilder();

		const commandData = client.commands.map((cmd) => {
			return {
				name: cmd.trigger,
				desc: cmd.description,
				dev: cmd.devOnly,
			};
		});

		embed.setTitle("Command List");
		embed.setDescription("Here is a list of all the commands available to you.");
		embed.setTimestamp(new Date().toISOString());

		for (const cmd of commandData) {
			if (cmd.dev && !client.moderatorIds.has(message.author.id)) continue; // hide dev commands from non dev's

			embed.addField(cmd.name, cmd.desc);
		}

		await message.channel?.createMessage({ embeds: [embed.toJSON()] });
	},
} as ICommand;

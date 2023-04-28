import { ICommand } from "../types.js";

export default {
	trigger: "ping",
	description: "Pong!",
	async run(_client, message) {
		await message.channel?.createMessage({ content: `Pong! My prefix is \`${process.env.BOT_PREFIX}\`, however I don't have any commands yet.` });
	},
} as ICommand;

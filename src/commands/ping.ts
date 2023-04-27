import { ICommand } from "../types.js";

export default {
	trigger: "ping",
	description: "Pong!",
	async run(_client, message) {
		await message.channel?.createMessage({ content: "Pong!" });
	},
} as ICommand;

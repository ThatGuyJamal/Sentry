import { Message } from "oceanic.js";
import { IClient, ILogger } from "types";

const permissions = "1497601666262"; // https://discordapi.com/permissions.html#1497601666262
export const constants = {
	BOT_INVITE: `https://discord.com/api/oauth2/authorize?client_id=${process.env.BOT_ID}&permissions=${permissions}&scope=bot%20applications.commands`,
};

/** Makes sure the .env file has all its requirements */
export function validateEnv({
	BOT_TOKEN,
	BOT_ID,
	BOT_PREFIX,
	MODERATORS_ID,
	logger = console,
}: {
	BOT_TOKEN: string;
	BOT_ID: string;
	BOT_PREFIX: string;
	MODERATORS_ID: string;
	logger?: ILogger;
}) {
	if (!BOT_TOKEN) throw new Error("BOT_TOKEN is not defined in the .env file.");
	if (!BOT_ID) throw new Error("BOT_ID is not defined in the .env file.");
	if (!BOT_PREFIX) throw new Error("BOT_PREFIX is not defined in the .env file.");
	if (!MODERATORS_ID) throw new Error("MODERATORS_ID is not defined in the .env file.");

	logger.log("Environment variables validated.");
}

/**
 * Processes message commands
 */
export async function processCommands(client: IClient, message: Message) {
	try {
		console.log("message content", message.content);

		const PREFIX = process.env.BOT_PREFIX as string;

		// We make sure the message is a command, not a bot, and not in a DM channel.
		if (!message.content.startsWith(PREFIX)) return;

		// Before we process the command, we need to split the message into an array and get its arguments.
		// This removes the prefix and splits the message into an array of arguments we can read.
		const args = message.content.slice(PREFIX.length).trim().split(/ +/);

		console.log("args", args);

		// We get the command name from the first argument.
		const command = args.shift()?.toLowerCase();

		console.log("command", command);

		if (command) {
			// We check if the command exists in the commands collection.
			const cmd = client.commands.get(command);

			console.log("cmd", cmd);

			if (cmd) return await cmd.run(client, message); // if the command exist we run it.
		}

		return;
	} catch (error) {
		console.error(error);
	}
}

/**
 * Loads all commands from the command directory into bot cache.
 * @param client
 */
export async function loadCommands(client: IClient) {
	// TODO: Turn this into a pure function.
	const pingCommand = (await import("./commands/ping.js")).default;

	client.commands.set(pingCommand.trigger, pingCommand);

	console.log(`Loaded ${client.commands.size} commands.`);
}

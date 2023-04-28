import { Client, Collection, TextChannel } from "oceanic.js";
import { config } from "dotenv";
import { loadCommands, processCommands, validateEnv } from "./utils.js";
import type { IClient } from "types.js";
import { processSpamModeration } from "./spamModeration";

config(); // Load .env file

// Validate environment variables
const envVariables = {
	BOT_TOKEN: process.env.BOT_TOKEN as string,
	BOT_ID: process.env.BOT_ID as string,
	BOT_PREFIX: process.env.BOT_PREFIX as string,
	MOD_ROLE_ID: process.env.MOD_ROLE_ID as string,
	logger: console,
};
validateEnv(envVariables);

const client = new Client({
	auth: `Bot ${envVariables.BOT_TOKEN}`,
	gateway: {
		// Which events we want from the discord api.
		intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES", "MESSAGE_CONTENT"],
	},
}) as IClient;

client.commands = new Collection();

client.on("ready", async () => {
	await loadCommands(client);
	console.log("Ready!");

	let ch = client.getChannel("837863488864124931") as TextChannel;
	if (ch) {
		await ch.createMessage({
			content: `**${client.user.username}** is online and ready to moderate! :crossed_swords: `,
		});
	}
});

// Message Sent
// https://docs.oceanic.ws/latest/interfaces/Events.ClientEvents.html#messageCreate
client.on("messageCreate", async (msg) => {
	// We don't want to process messages from bots.
	if (msg.author.bot) return;

	await processCommands(client, msg);
	await processSpamModeration(client, msg);
});

// An error handler
client.on("error", (error) => {
	console.error("Something went wrong:", error);
});

// Connect to Discord
client.connect();

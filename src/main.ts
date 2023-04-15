import { Client } from "oceanic.js";
import { config } from "dotenv";
import { validateEnv } from "./utils.js";

config(); // Load .env file

// Validate environment variables
validateEnv();

const PREFIX = process.env.BOT_PREFIX as string // we can omit type as we have validated it.

const client = new Client({
	auth: `Bot ${process.env.BOT_TOKEN}`,
	gateway: {
		// Enables caching on the discord gateway. This is required for the cache to work.
		intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES", "MESSAGE_CONTENT"],
	},
});

client.on("ready", () => {
	console.log("Ready!");
});

// Message Sent
// https://docs.oceanic.ws/latest/interfaces/Events.ClientEvents.html#messageCreate
client.on("messageCreate", (msg) => {
	if (msg.author.bot) return; // Ignore bots
    
    if(msg.content === `${PREFIX}ping`) {
        msg.channel?.createMessage({ content: "pong" })
    }
});

// An error handler
client.on("error", (error) => {
	console.error("Something went wrong:", error);
});

// Connect to Discord
client.connect();

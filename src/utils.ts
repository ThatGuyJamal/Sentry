const permissions = "1497601535190"; // https://discordapi.com/permissions.html
export const constants = {
	BOT_INVITE: `https://discord.com/api/oauth2/authorize?client_id=${process.env.BOT_ID}&permissions=${permissions}&scope=bot%20applications.commands`,
};

export function validateEnv() {
	if (!process.env.BOT_TOKEN)
		throw new Error("BOT_TOKEN is not defined in the .env file.");
	if (!process.env.BOT_ID)
		throw new Error("BOT_ID is not defined in the .env file.");
	if (!process.env.BOT_PREFIX)
		throw new Error("BOT_PREFIX is not defined in the .env file.");
}

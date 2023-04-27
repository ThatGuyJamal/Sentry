import { Message } from "oceanic.js";
import { IClient, ILogger } from "types";

// Store user messages for spam detection
const spamCache = new Map();

// Number of duplicate messages to trigger a spam warning
export const spamThreshold = 2;
export const spamTimeThreshold = 5 * 1000; // 5 seconds
export const spammerMuteTime = 5 * 60 * 1000; // 5 minutes

export type UserMessage = {
	authorId: string;
	channelId: string;
	content: string;
	timestamp: Date;
};

/**
 * Checks if a message is spamming.
 * @param message The message to check for spam.
 * @param logger The logger to use.
 * @returns boolean
 */
export function isSpamming(
	authorId: string,
	channelId: string,
	content: string,
	timestamp: Date,
	logger: ILogger = console
): boolean {
	try {
		if (!spamCache.has(authorId)) {
			spamCache.set(authorId, []);
		}

		const userMessages = spamCache.get(authorId);
		userMessages.push({
			content: content,
			channelID: channelId,
			timestamp: timestamp,
		});

		// Remove old messages from cache (you can customize the time range)
		const recentMessages = userMessages.filter(
			(msg: UserMessage) => timestamp.getTime() - msg.timestamp.getTime() < spamTimeThreshold
		);
		spamCache.set(authorId, recentMessages);

		// Check for spamming
		const duplicateMessages = recentMessages.filter((msg: UserMessage) => msg.content === content);

		if (duplicateMessages.length >= spamThreshold) {
			return true;
		}

		return false;
	} catch (error) {
		logger.error(error);
		return false;
	}
}

export async function processSpamModeration(client: IClient, message: Message, logger: ILogger = console) {
	try {
		const x = client.gatewayURL;
		logger.log("Checking spam...", x);
		if (
			!message.member?.permissions.json.ADMINISTRATOR &&
			!message.member?.communicationDisabledUntil &&
			isSpamming(message.author.id, message.channelID, message.content, new Date(), logger)
		) {
			logger.log("Spam detected!");

			await message.channel?.createMessage({
				content: `Spam detected! You're going to timeout. FYI <@&${process.env.MODERATORS_ID}>`,
			});

			await message.member?.edit({
				communicationDisabledUntil: new Date(Date.now() + spammerMuteTime).toISOString(),
			});
		}
	} catch (error) {
		logger.error(error);
	}
}

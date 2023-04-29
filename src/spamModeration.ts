import { Message } from "oceanic.js";
import { IClient, ILogger } from "types";

// Store user messages for spam detection
const spamCache = new Map<string, UserMessage>();

// Number of duplicate messages to trigger a spam warning
export const spamThreshold = 3;
export const spamTimeThreshold = 5 * 1000; // 5 seconds
export const spammerMuteTime = 24 * 60 * 60 * 1000; // 24 hours

export type UserMessage = {
	channelId: string;
	content: string;
	timestamp: Date;
}[];

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
		userMessages?.push({
			content: content,
			channelId: channelId,
			timestamp: timestamp,
		});

		// Remove old messages from cache (you can customize the time range)
		const recentMessages = userMessages?.filter(
			(msg) => timestamp.getTime() - msg.timestamp.getTime() < spamTimeThreshold
		);
		spamCache.set(authorId, recentMessages!);

		// Check for spamming
		const duplicateMessages = recentMessages?.filter((msg) => msg.content === content);

		console.dir(userMessages, { depth: Infinity });
		console.dir(recentMessages, { depth: Infinity });
		console.dir(duplicateMessages, { depth: Infinity });

		if (duplicateMessages!.length >= spamThreshold) {
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
			!message.member?.permissions.json.MANAGE_MESSAGES &&
			!message.member?.communicationDisabledUntil &&
			isSpamming(message.author.id, message.channelID, message.content, new Date(), logger)
		) {
			logger.log("Spam detected!");

			await message.channel?.createMessage({
				content: `Spam detected! You're going to timeout. FYI ` + `<@&${process.env.MOD_ROLE_ID}>`,
			});

			await message.member
				?.edit({
					communicationDisabledUntil: new Date(Date.now() + spammerMuteTime).toISOString(),
				})
				.catch((error) => {
					message.channel?.createMessage({
						content: `Failed to mute <@${message.author.id}>. ${error.message}`,
					});
					logger.error(error);
				});
		}
	} catch (error) {
		logger.error(error);
	}
}

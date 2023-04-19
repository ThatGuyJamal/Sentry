import { isSpamming, spamThreshold, spamTimeThreshold } from "./spamModeration";

const NullLogger = {
	log: () => {},
	error: () => {},
	warn: () => {},
	info: () => {},
};

describe("isSpamming", () => {
	test("it should not detect spamming when the message count is within the threshold", () => {
		const authorId = "123";
		const channelId = "channel1";
		const content = "Hello!";
		const timestamp = new Date();

		let result = false;

		for (let i = 1; i < spamThreshold; i++) {
			result = isSpamming(authorId, channelId, content, timestamp, NullLogger);
		}

		expect(result).toBe(false);
	});

	test("it should detect spamming when the message count is outside of the threshold", () => {
		const authorId = "123";
		const channelId = "channel1";
		const content = "Hello!";
		const timestamp = new Date();

		let result = false;

		for (let i = 1; i <= spamThreshold; i++) {
			result = isSpamming(authorId, channelId, content, timestamp, NullLogger);
		}

		expect(result).toBe(true);
	});

	test("it should not detect spamming when the same message is sent outside of the time threshold", () => {
		const authorId = "123";
		const channelId = "channel1";
		const content = "Hello!";
		const timestamp = new Date();

		for (let i = 1; i < spamThreshold; i++) {
			isSpamming(authorId, channelId, content, timestamp, NullLogger);
		}

		const result = isSpamming(
			authorId,
			channelId,
			content,
			new Date(timestamp.getTime() + spamTimeThreshold),
			NullLogger
		);

		expect(result).toBe(false);
	});
});

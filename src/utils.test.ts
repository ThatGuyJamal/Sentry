import { validateEnv } from "./utils";

describe("validateEnv", () => {
	afterEach(() => {
		jest.restoreAllMocks();
	});

	it("should validate environment variables and call console.log", () => {
		const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

		const mockEnvVariables = {
			BOT_TOKEN: "sample_bot_token",
			BOT_ID: "sample_bot_id",
			BOT_PREFIX: "sample_bot_prefix",
			logger: console,
		};

		validateEnv(mockEnvVariables);

		expect(logSpy).toHaveBeenCalled();
	});

	it("should throw an error if BOT_TOKEN is falsy", () => {
		const mockEnvVariables = {
			BOT_TOKEN: "",
			BOT_ID: "sample_bot_id",
			BOT_PREFIX: "sample_bot_prefix",
			logger: console,
		};

		expect(() => validateEnv(mockEnvVariables)).toThrow();
	});

	it("should throw an error if BOT_ID is falsy", () => {
		const mockEnvVariables = {
			BOT_TOKEN: "sample_bot_token",
			BOT_ID: "",
			BOT_PREFIX: "sample_bot_prefix",
			logger: console,
		};

		expect(() => validateEnv(mockEnvVariables)).toThrow();
	});

	it("should throw an error if BOT_PREFIX is falsy", () => {
		const mockEnvVariables = {
			BOT_TOKEN: "sample_bot_token",
			BOT_ID: "sample_bot_id",
			BOT_PREFIX: "",
			logger: console,
		};

		expect(() => validateEnv(mockEnvVariables)).toThrow();
	});
});

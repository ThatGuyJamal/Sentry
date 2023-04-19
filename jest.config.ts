import type { Config } from "jest";

const config: Config = {
	verbose: true,
	moduleFileExtensions: ["ts", "js"],
	testMatch: ["**/src/**/*.test.ts"],
};

export default config;

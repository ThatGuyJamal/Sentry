import { Client, Collection, Message } from "oceanic.js";

export interface ICommand {
	trigger: string;
	description: string;
	aliases?: string[]; // todo - implement  command aliases
	run: (client: IClient, message: Message) => Promise<any> | any;
}

/**
 * Extends the Client class to add our own properties.
 */
export interface IClient extends Client {
	commands: Collection<string, ICommand>;
}

/**
 * Logger interface
 * @param message The message to log.
 * @param optionalParams Any additional parameters to log.
 * @returns void
 */
export interface ILogger {
	log: (message?: any, ...optionalParams: any[]) => void;
	error: (message?: any, ...optionalParams: any[]) => void;
	warn: (message?: any, ...optionalParams: any[]) => void;
	info: (message?: any, ...optionalParams: any[]) => void;
}

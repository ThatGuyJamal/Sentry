import { Client, Collection, Message } from "oceanic.js";

export interface Command {
    trigger: string;
    description: string;
    aliases?: string[]; // todo - implement  command aliases
    run: (client: IClient, message: Message) => Promise<any> | any;
}

/**
 * Extends the Client class to add our own properties.
 */
export interface IClient extends Client {
    commands: Collection<string, Command>;
}
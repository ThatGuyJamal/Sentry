import { ICommand } from "../../types.js";

// todo - make this work for commands in any sub dirs of src/commands
export default {
	trigger: "reload",
	description: "Reloads a command",
	usage: "reload <command name>",
	devOnly: true,
	async run(client, message, args) {
		const commandName = args[0];

        console.log(args)
        console.log("commandName", commandName)

		if (!commandName) {
			await message.channel?.createMessage({ content: "Please provide a command name to reload." });
			return;
		}

		const command = client.commands.get(commandName);

		if (!command) {
			await message.channel?.createMessage({ content: `The command \`${commandName}\` does not exist.` });
			return;
		}

		delete require.cache[require.resolve(`../${commandName}.js`)];

		const newCommand = await import(`../${commandName}.js`);
		client.commands.set(newCommand.default.trigger, newCommand.default);

		await message.channel?.createMessage({ content: `The command \`${commandName}\` has been reloaded.` });
	},
} as ICommand;

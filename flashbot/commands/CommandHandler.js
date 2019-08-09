//Export the class
module.exports = class CommandHandler {
	static load() {
		//Assign static commandMap object with {key=commandstring : value=handlerClass(?instance)}
		CommandHandler.commandMap = new Object();

		//Add your commands...
		CommandHandler.addCommand("help", require("./Help.js"));
		CommandHandler.addCommand("csv2json", require("./CSV2JSON.js"));
		CommandHandler.addCommand("guild", require("./Guild.js"));
		CommandHandler.addCommand("roles", require("./Roles.js"));
		CommandHandler.addCommand("ahaa", require("./Ahaa.js"));
		CommandHandler.addCommand("mysql", require("./MySQL.js"));
		CommandHandler.addCommand("inline", (msg, args) => { msg.reply("Inline function") });
		
		//Printout of how many commands loaded
		console.log("Loaded " + Object.keys(CommandHandler.commandMap).length + " commands");
	}
	
	static addCommand(commandString, handlerClass) {
		CommandHandler.commandMap[commandString] = handlerClass;
		console.log("Added command: " + commandString);
	}
	
	static async handleCommand(msg, args) {
		if(args.length > 0) {
			//Get the command handler class from the first argument
			var command = CommandHandler.commandMap[args.shift()];
		}
		
		//If the command doesn't exist
		if(!command) {
			//Default to the help menu
			var command = CommandHandler.commandMap["help"];
		}
		
		//Attempt to handle the command
		try {
			if(command.handle)
				//If it has run prop, it is command module, so call command.handle()
				var result = await command.handle(msg, args);
			else
				//If it an inline function, run it as is
				var result = await command(msg, args);
		
			console.log(result);
		} catch (err) {
			//Catch, and print any errors
			msg.reply(err.message);
		}
	}
};

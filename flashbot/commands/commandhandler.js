//Export the class
module.exports = class CommandHandler {
	static load() {
		//Assign static commandMap object with {key=commandstring : value=handlerClass(?instance)}
		CommandHandler.commandMap = new Object();

		//Add your commands...
		CommandHandler.addCommand("help", require("./help.js"));
		CommandHandler.addCommand("csv2json", require("./csv2json.js"));
		CommandHandler.addCommand("guild", require("./guild.js"));
		CommandHandler.addCommand("roles", require("./roles.js"));
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
			if(isClass(command))
				//If it is a command module, call command.handle()
				var result = await command.handle(msg, args);
			else
				//If it an inline function, run it as is
				var result = await command(msg, args);
			
			//Output the result
			console.log(result);
		} catch (err) {
			//Catch, and print any errors
			msg.reply(err.message);
		}
	}
};

//ES2015

function isClass(func) {
	return typeof func === "function" && /^class\s/.test(Function.prototype.toString.call(func));
}
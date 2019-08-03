//Export the class
module.exports = class CommandHandler {
	static load() {
		//Assign static commandMap object with {key=commandstring : value=handlerClass(?instance)}
		CommandHandler.commandMap = new Object();

		//Add your commands...
		CommandHandler.addCommand("csv2json", require("./CSV2JSON.js"));

		//Printout of how many commands loaded
		console.log("Loaded " + Object.keys(CommandHandler.commandMap).length + " commands");
	}
	
	static addCommand(commandString, handlerClass) {
		CommandHandler.commandMap[commandString] = handlerClass;
		console.log("Added command: " + commandString + ", handler: " + handlerClass);
	}
	
	static async handleCommand(msg, args) {
		if(args.length == 0) {
			msg.reply("Please see !flash help");
			return;
		}
		
		//Get the command handler class
		let command = CommandHandler.commandMap[args.shift()];
		
		//If the command doesn't exist
		if(!command) {
			msg.reply("No such command exists! See !flash help");
			return;
		}
		
		try {
			//Attempt to handle the command
			var response = await command.handle(args);
			console.log(response);
			msg.reply(JSON.stringify(response));
		} catch (err) {
			//Catch, and print any errors
			msg.reply(err.message);
		}
	}
};
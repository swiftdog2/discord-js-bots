//Required npm packages
const Discord = require("discord.js");
const fs = require("fs");

//Required imports
const CommandHandler = require("./commands/CommandHandler.js");

//Define constants
const name = "FlashBot";
const prefix = "!flash";

// Create a new client
const client = new Discord.Client();

//Display a message once the bot has started
client.on("ready", () => {
	console.log(name + " loaded successfully.");
});

//Check messages for a specific command
client.on("message", async msg => {
	//Ignore messages from bots
	if(msg.author.bot)
		return;
	
	//Get the input as lowercase
	var str = msg.content.toLowerCase();

	//Input must begin with the required prefix
	if(str.startsWith(prefix)) {
		//Remove the prefix
		str = str.slice(prefix.length + 1);
		
		//Split up the string into arguments
		var args = str.split(/\s+/);
		
		//Pass the arguments to the CommandHandler
		CommandHandler.handle(msg, args);
	}
});

//Functions accepts key command
function handleCommand(command) {
	
	
	let cmd = commands[command];
	
	//Check if command exists
	if(!commands[command])
		return false;
	
	commands[command]();
}

//Load the token from file
await fs.readFile("token.txt", "utf-8", function(err, data) {
	if(err)
		console.log(err);
});

//Load the CommandHandler
CommandHandler.load();

client.login(data);

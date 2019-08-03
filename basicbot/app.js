//Required imports
const Discord = require("discord.js");
const fs = require("fs");
const multiMap = require("collections/multi-map");

//Define constants
const name = "BasicBot";
const prefix = "!hellothere";

// Create a new client
const client = new Discord.Client();

//Display a message once the bot has started
client.on("ready", () => {
	console.log(name + " loaded successfully.");
});

//Load commands into an obj structure


//Check messages for a specific command
client.on("message", msg => {
	//Ignore messages from bots
	if(msg.author.bot)
		return;
	
	//Get the input as lowercase
	str = msg.content.toLowerCase();

	//Input must begin with the required prefix
	if(!str.startsWith(prefix))
		return;
	
	//Remove the prefix
	str = str.slice(prefix.length + 1);
	
	var args = str.split(/\s+/);
	
	handleCommand(args);
	
		
	
	
	//Hello there!
	msg.reply("General Kenobi");
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
fs.readFile("token.txt", "utf-8", function(err, data) {
	if(err)
		console.log(err);
	client.login(data);
});

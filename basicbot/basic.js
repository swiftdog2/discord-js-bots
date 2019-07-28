const Discord = require("discord.js");
const fs = require("fs");

//Define constants
const name = "BasicBot";

// Create a new client
const client = new Discord.Client();

//Display a message once the bot has started
client.on("ready", () => {
	console.log(name + " loaded successfully.");
});

//Check messages for a specific command
client.on("message", msg => {
	//Ignore messages from bots
	if(msg.author.bot)
		return;
	
	//Get the input as lowercase
	str = msg.content.toLowerCase();

	//Hello there!
	if (str.startsWith("!hellothere"))
		msg.reply("General Kenobi");
});

//Load the token from file
fs.readFile("token.txt", "utf-8", function(err, data) {
	if(err)
		console.log(err);
	client.login(data);
});

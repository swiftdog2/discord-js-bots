//Required imports
const Discord = require("discord.js");
const sharp = require("sharp");
const http = require("http");
const fs = require("fs");
const fetch = require('node-fetch');

//Define constants
const name = "SharpBot"
const colour = "#99CC00"; //Lime green
const max_image_size = 1048576 * 2; //Max image size is 2MB
const prefix = "!sharp"

//Create a new client using the new keyword
const client = new Discord.Client();

//Display a message once the bot has started
client.on("ready", () => {
    console.log(name + " loaded.");
});

//Check messages for a specific command
client.on("message", msg => {
	//Ignore messages from other bots
	if(msg.author.bot)
		return;
	
	//Reduce the input to lowercase form
	var str = msg.content.toLowerCase();

	//Must start with the required prefix
	if (!str.startsWith(prefix))
		return;
	
	//Remove the prefix
	str = str.slice(prefix.length + 1);
	
	//Display the rich info mind if the user needs help
	if(str == "help" || str == "info") {
		console.log("test");
		msg.reply(getEmbedInfo());
		return;
	}
		
	//Otherwise, split up the string into arguments, consuming all whitespace
	var args = str.split(/\s+/);
	
	//If the user did not specify both an operation and a value
	if(args.length < 2) {
		msg.reply("Invalid operation or value specified, please see !sharp help");
		return;
	}
	
	//Determine the operation we want to run (resize, stretch, help, etc)
	var operation = args[0];
	
	//Get the input for the operation (image dimensions)
	var dimensions = parseDimension(args[1])
	
	//Invalid dimensions specified
	if(dimensions.length === 0) {
		msg.reply("Invalid width and/or height specified, please see !sharp help");
		return;
	}

	//Cache the dimensions in more readable variables "width" and "height"
	var width = dimensions[0];
	var height = dimensions[1];
	
	if(operation === "resize") {
		//Preserve aspect ratio, resize image to provided dimensions
		msg.reply("Resizing image(s)! Please wait...");
		
		//Resize the image (preserve aspect ratio by default)
		var transform = sharp().resize(width, height, {
			fit: sharp.fit.inside
		});
	} else if(operation === "stretch") {
		//Stretches image to the provided dimensions (ignores aspect ratio)
		msg.reply("Stretching image(s)! Please wait...");
		
		var transform = sharp().resize(width, height, {
			fit: sharp.fit.fill
		});
	} else {
		//Catch unspecified/malformed operations
		showInfo(msg);
		return;
	}
	
	//Requires image attachments (for the moment)
	if(msg.attachments.size == 0) {
		msg.reply("Please attach some images for processing.");
		return;
	}
	
	//Now that the parameter string is built, download all of the attachments
	msg.attachments.forEach(attachment => {
		//Download the file from the Discord CDN
		fetch(attachment.url)
			.then(res => {
				//Pipe into the sharp buffer
				res.body.pipe(transform);
					
				return new Promise((resolve, reject) => {
				  res.body.on("end", resolve)
				  res.body.on("error", reject)
				});
			})
			.then(() => {
				var attach = new Discord.Attachment(transform);
				
				msg.channel.send(attach)
					.then(console.log)
					.catch(console.error);
			});
	});
});

//Return the dimensions from WxH (or die trying)
function parseDimension(dimString) {
	//Set defaults just in case
	var dimension = [];
	
	//Split the values up into array
	var values = dimString.split(/x+/);
	
	//Don't want to run into ArrayIndexOutOfBoundsException
	if(values.length == 2) {
		var width = parseInt(values[0]);
		var height = parseInt(values[1]);
		
		//If it's a proper number
		if(!isNaN(width) && !isNaN(height)) {
			//And if they're not ridiculously large
			if(width <= 1000 && height <= 1000) {
				//Return the dimensions they want
				return [width, height];
			}
		}
	}
	
	return dimension;
}

function getEmbedInfo() {
	return new Discord.RichEmbed()
		.setColor(colour)
		.setTitle("SharpBot")
		.setDescription("High-speed image resizing & conversion bot.")
		.addField("!sharp resize WIDTHxHEIGHT", "Resizes an image, preserves aspect ratio")
		.addField("!sharp stretch WIDTHxHEIGHT", "Resizes the image, ignores aspect ratio")
		.addField("Example: !sharp resize 250x300", "Resizes the image to 250x300 (preserves aspect ratio)");
}

//Load the token from file
fs.readFile("token.txt", "utf-8", function(err, data) {
	if(err)
		console.log(err);
	//And login
	client.login(data);
});

//Required imports
const Discord = require("discord.js");
const fs = require("fs");
const gm = require("gm").subClass({imageMagick: true});
const fetch = require('node-fetch');
const { execFile } = require('child_process');

//Define constants
const name = "ImageMagick"
const purple = "#7700BC";
const max_image_size = 1048576; //max image size is 1MB
const prefix = "!magick"

// Create a new client using the new keyword
const client = new Discord.Client();

//Display a message once the bot has started
client.on("ready", () => {
    console.log("ImageMagick loaded.");
});

//Check messages for a specific command
client.on("message", msg => {
	//Ignore messages from bots
	if(msg.author.bot)
		return;
	
	//Get the input as lowercase
	str = msg.content.toLowerCase();

	//Requires the prefix "!magick"
	if (!str.startsWith(prefix))
		return;
	
	//Requires image attachments (currently)
	if(msg.attachments.size == 0) {
		msg.reply("Please attach some images for processing");
		return;
	}

	//Split up the arguments by any amount of white space
	var args = str.slice(prefix.length + 1).split(/\s+/);

	//The parameters which will be applied to all of the attachments (after download)
	var parameters = ""

	//Parse all of the input parameters
	while(true) {
		//Parameters come in the form flag:value
		const flag = args.shift();
		const value = args.shift();
		
		//True if flag is null, or undefined
		if(flag == null) {
			console.log("End of stream");
			break; //Break out, run the command
		} else if (value == null) {
			console.log("No value specified for flag: '" + flag + "'");
			return;
		}
		
		console.log("Flag: '" + flag + "', value: '" + value + "'");

		//Make sure that the flag:value is valid
		if(checkFlag(msg, flag, value) === false) {
			console.log("Flag: '" + flag + "' was not found, please consult !magick help");
			return;
		}
		
		//Add the parameters to the parameter string
		parameters += "-" + flag + " " + value
	}
	
	//None of the parameters were valid, abort
	if(parameters.length == 0) {
		console.log("Please enter some valid parameters!");
		return;
	}

	console.log("parameter string: '" + parameters + "'");
	
	//List of file names
	var files = [];
	var extensions = [];
	
	//Now that the parameter string is built, download all of the attachments
	msg.attachments.forEach(attachment => {
		//Get the file extension (not secure, but works for non-malicious images)
		var extension = attachment.url.substring(attachment.url.lastIndexOf("."));
		extensions.push(extension);
		console.log("Expected file extension: " + extension);

		//Try to avoid frequent clashing, important if all images have same name
		var fileName = generate_id(8) + extension;
		
		//Push the filename into the array
		files.push(fileName);

		//Download the file
		console.log("Downloading file attachment as '" + fileName + "'");
		
		fetch(attachment.url)
			.then(res => {
				const dest = fs.createWriteStream(fileName);
				res.body.pipe(dest);
				
				return new Promise((resolve, reject) => {
				  res.body.on("end", resolve)
				  res.body.on("error", reject)
				});
			})
			.then(() => {
				var newFile = generate_id(8) + extension;
				console.log("executing: magick " + fileName + " " + parameters + " " + newFile);
				
				var params = (fileName + " " + parameters + " " + newFile).split(" ");
				
				//Execute the shell command on the file
				const child = execFile('magick', params, (error, stdout, stderr) => {
					if (error) {
						console.error('stderr', stderr);
						throw error;
					}
					
					//Send the new file back
					msg.channel.send(new Discord.Attachment(fs.createReadStream(newFile), newFile))
						.then(console.log)
						.catch(console.error);
				});
			});
	
	});
});

function checkFlag(msg, flag, value) {
	var checked = false;

	switch(flag) {
		//Resize image flag, can come in two forms: absolute (WxH), and relative (W%:H%)
		case "resize":
			var dimension = value.split(/x+/);
			console.log("Dimension length: " + dimension.length);
			if(dimension.length == 2) {
				var width = parseInt(dimension[0]);
				var height = parseInt(dimension[1]);
				console.log("Width: '" + width + "', height: '" + height + "'");
				if(isNaN(width)) {
					console.log("Invalid width specified, must be integer");
					return false;
				}
				if(isNaN(height)) {
					console.log("Invalid height specified, must be integer");
					return false;
				}
				return true;
			} else {
				console.log("Invalid usage, should be like 10x10")
			}
		case "snap":
			return true;
	}
	return false
}

function generate_id(length) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

function showInfo(msg) {
	const embed = new Discord.RichEmbed()
	.setColor(purple)
	.setTitle("ImageMagick")
	.setDescription("Discord Bot wrapper around the powerful ImageMagick library.")
	.addField("!snap info", "Displays this info menu");
	msg.reply(embed);
}

//Load the token from file
fs.readFile("token.txt", "utf-8", function(err, data) {
	if(err)
		console.log(err);
	client.login(data);
});

 
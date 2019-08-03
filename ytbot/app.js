//Required imports
const Discord = require("discord.js");
const ytdl = require("ytdl-core");
const fs = require("fs");
const ffmpeg = require('fluent-ffmpeg');

//Define constants
const name = "YoutubeBot";
const colour = "#FF0000"; //Red
const prefix = "!ytbot";

// Create a new client
const client = new Discord.Client();

//Display a message once the bot has started
client.on("ready", () => {
    console.log(name + " loaded successfully.");
});

//Check messages for a specific command
client.on("message", msg => {
	//Ignore messages from other bots...
	if(msg.author.bot)
		return;

	//DO NOT TAKE LOWERCASE (ONLY PARAMETER IS YOUTUBE URL!!!)
	var str = msg.content;

	//Must start with the required prefix
	if (!str.toLowerCase().startsWith(prefix))
		return;

    //Send back a reply when the specified command is used
	var url = str.substr(prefix.length + 1);
	
	if(!ytdl.validateURL(url)) {
		msg.reply("Invalid link specified!");
		return;
	}
	
	//Default title for the audio
	var title = "song.mp3";
	
	//Declare the ffmpeg function which downloads then converts the song
	var song = ffmpeg()
		.input(ytdl(url, { filter: format => { return format.container === 'm4a' && !format.encoding; }}))
		.format("mp3")
		.on("error", (err) => console.error(err))
		.on('progress', progress => {
			process.stdout.cursorTo(0);
			process.stdout.clearLine(1);
			process.stdout.write(progress.timemark);
		})
		.on("end", () => {
			msg.reply("Conversion to MP3 complete!");
		});
		
	//Now get video info (because the above function doesn't actually run, we can't get it there)
	ytdl(url).on("info", (info) => {
		//Cache the video title
		title = info.title;
		msg.reply("Downloading '" + title + "' as MP3, please wait..."); 
		
		//Once info is received, we run song.pipe() to stream the results
		msg.channel.send(new Discord.Attachment(song.pipe(), title + ".mp3"))
			.then(console.log)
			.catch(console.error);
	});
});

//Load the token from file
fs.readFile("token.txt", "utf-8", function(err, data) {
	if(err)
		console.log(err);
	client.login(data);
});

const Discord = require("discord.js");
const cheerio = require('cheerio');
const http = require('http');
const fs = require("fs");

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
	if(!str.startsWith(prefix))
		return;
	
	//Remove the prefix
	str = str.slice(prefix.length + 1);
	
	var args = str.split(/\s+/);
	
	if(args.length >= 1) {
		switch(args[0]) {
			case "guild":
				msg.reply("Guild ID: " + msg.guild.id);
			break;
			case "roles":
				var roles = msg.guild.roles;
				if(args.length >= 2) {
					//Default to page 1
					var page = 1;

					switch(args[1]) {
						case "all":
							//Page number specified
							if(args.length >= 3)
								page = args[2];

							var embed = new Discord.RichEmbed()
								.setColor("#31DE1F");
							
							roles = roles.sort((a, b) => {
								return b.members.size - a.members.size;
							});
							
							//Add the page to the embed
							var pages = paginate(embed, "Role Statistics", roles, page, 10);
							await msg.reply(embed);

							if(pages > 1)
								msg.channel.send("Use `!flash roles all <page>` for more pages");
							
						break;
						case "empty":
							var emptyRoles = roles.filter(role => role.members.size == 0);
							if(emptyRoles.size == 0) {
								msg.reply("No empty roles found!");
								return;
							}
							
							var embed = new Discord.RichEmbed()
								.setColor("#FF0000")
								.setTitle("Found " + emptyRoles.size + " empty roles:");
							
							emptyRoles.forEach(role => {
								embed.addField(role.name, "0 users");
							});
							
							msg.reply(embed);
						break;
						case "list":
							if(args.length < 3) {
								msg.channel.send("Please specify a role to list");
								return;
							}
							
							var listRole = args[2];
							var found = false;
							
							roles.forEach(role => {
								var str = new String;
								
								//Find the role which matches the input
								if(role.name.toLowerCase().startsWith(listRole)) {
									found = true;
									
									role.members.forEach(member => {
										str += "**" + member.displayName + "**, ";
									});
									
									msg.channel.send(role + " has " + role.members.size + " users: " + str);
								}
							});
							
							if(!found) {
								msg.channel.send("No such role found! Try again");
								return;
							}
						break;
					}
				}
			break;
			default:
				msg.channel.send("Unrecognized option");
			break;
		}
	}
});

function paginate(embed, title, data, page, per_page) {
	//console.log("Page: " + page + ", results per page: " + per_page);
	
	var totalPages = Math.ceil(data.size / per_page);
	
	//Cap the page number to the last one
	page = Math.min(page, totalPages);
	//Don't let the index be below 1 either
	page = Math.max(1, page);

	embed.setTitle(title + " (page " + page + " of " + totalPages + ")");

	var keys = data.keyArray();
	var start = (page - 1) * per_page;
	var end = Math.min(data.size, start + per_page);
	//console.log(data);
	
	for(i = start; i < end; i++) {
		var role = data.get(keys[i]);
		//console.log("role: " + role.name);
		embed.addField("\u200b", role + " has " + role.members.size + " users");
	}
	
	return totalPages;
}


//Load the token from file
fs.readFile("token.txt", "utf-8", function(err, data) {
	if(err)
		console.log(err);
	client.login(data);
});

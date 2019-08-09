const Discord = require("discord.js");

module.exports = class Roles {
	static async handle(msg, args) {
		let roles = msg.guild.roles;
		console.log(args);
		
		var embed = new Discord.RichEmbed().setColor("#4CABFE");
		
		switch(args[0]) {
			//List the roles based on filter
			case "list":
				//Default to page 1
				var page = 1;
				
				//If filter specified, page param accepted on arg[2]
				if(args.length >= 3) {
					page = args[2];
					console.log("Filter page: " + page);
				}
				
				switch(args[1]) {
					case "empty":
						roles = roles.filter(role => role.members.size == 0);
						
						//If none of the roles are empty
						if(roles.size == 0) {
							msg.channel.send("No empty roles found!");
							return;
						}
						
						roles.forEach(role => {
							embed.addField(role.name, "\u200b");
						});
						
						//Add the page to the embed
						var pages = Roles.paginate(embed, "Empty Roles", roles, page, 5);
						
						//If there is more than one page
						if(pages > 1)
							embed.setDescription("Use `!flash roles list empty <?page>` for more pages");
					break;
					case "all": //List all roles in order of member #
						//Since no filter specified, page param accepted on arg[1]
						if(args.length > 2)
							page = args[2];
						
						//Sort the roles by member size
						roles = roles.sort((a, b) => {
							return b.members.size - a.members.size;
						});
						
						//Add the page to the embed
						var pages = Roles.paginate(embed, "Role Statistics", roles, page, 5);
						
						//If there is more than one page
						if(pages > 1)
							embed.setDescription("Use `!flash roles list all <?page>` for more pages");
					break;
					default:
						embed.setDescription("Accepted inputs for `!flash roles list <filter> <?page>`")
							.addField("all <?page>", "List all roles in this guild in order of member count")
							.addField("empty <?page>", "List roles that are not assigned to anyone");
					break;
				}
				
				msg.channel.send(embed);
			break;
			case "count":
				if(args.length < 2) {
					msg.channel.send("Please specify a role to list");
					return;
				}
				
				var listRole = args[1];
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
			default:
				embed.setDescription("Accepted inputs for `!flash roles <action>`")
					.addField("count <role>", "Prints the number of users with a role")
					.addField("list <filter> <?page>", "List roles in this guild specified by some filter")
				msg.channel.send(embed);
			break;
		}
	}
	
	static paginate(embed, title, data, page, per_page) {
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
		
		for(let i = start; i < end; i++) {
			var role = data.get(keys[i]);
			//console.log("role: " + role.name);
			embed.addField("\u200b", role + " has " + role.members.size + " users");
		}
		
		return totalPages;
	}
	};
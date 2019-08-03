const Discord = require("discord.js");

module.exports = class guild {
	static async handle(msg, args) {
		if(args.length == 0)
			throw new Error("No input specified, please see !guild help");
		
		let param1 = args[0];
		
		switch(param1) {
			case "info":
				var embed = new Discord.RichEmbed()
					.setColor("#11DE1F")
					.addField("Name", msg.guild.name)
					.addField("ID", msg.guild.id);
			break;
			case "help":
				var embed = new Discord.RichEmbed()
					.setColor("#11DE1F")
					.addField("info", "Gives guild information")
					.addField("help", "Show this information menu");
				msg.channel.send("A list of inputs for `!flash guild <input>`" + embed);
			break;
		}
		
		console.log("Printing guild information.");
		
		return 0;
	}
};
const Discord = require("discord.js");

module.exports = class guild {
	static async handle(msg, args) {
		let param1 = args[0];

		if(args.length == 0)
			param1 = "help";
			//throw new Error("No input specified, please see `!flash guild help`");
		
		switch(param1) {
			case "info":
				var embed = new Discord.RichEmbed()
					.setDescription("Some information about this guild:")
					.setColor("#11DE1F")
					.addField("Name", msg.guild.name)
					.addField("ID", msg.guild.id);
				msg.channel.send(embed);
			break;
			case "help":
				var embed = new Discord.RichEmbed()
					.setDescription("A list of inputs for `!flash guild <input>`")
					.setColor("#11DE1F")
					.addField("info", "Provides basic guild information")
					.addField("help", "Displays this information menu (recursion is fun)");
				msg.channel.send(embed);
			break;
		}
		
		console.log("Printing guild information.");
		
		return 0;
	}
};
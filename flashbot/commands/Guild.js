const Discord = require("discord.js");

module.exports = class Guild {
	static async handle(msg, args) {
		switch(args[0]) {
			case "info":
				var embed = new Discord.RichEmbed()
					.setDescription("Some information about this guild:")
					.setColor("#11DE1F")
					.addField("Name", msg.guild.name)
					.addField("ID", msg.guild.id);
				msg.channel.send(embed);
			break;
			default:
				var embed = new Discord.RichEmbed()
					.setDescription("Accepted inputs for `!flash guild <input>`")
					.setColor("#11DE1F")
					.addField("info", "Provides basic guild information");
					//.addField("help", "Displays this information menu (recursion is fun)");
				msg.channel.send(embed);
			break;
		}
	}
};

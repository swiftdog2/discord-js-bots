const Discord = require("discord.js");

module.exports = class help {
	static async handle(msg, args) {
		var embed = new Discord.RichEmbed()
			.setColor("#FF0000")
			.addField("Flash Commands", "Commands are of the form `!flash <command> <inputs>`")
			.addField("guild", "Information about this guild")
			.addField("roles", "Commands for managing roles");
		msg.channel.send(embed);
	}
};
const Discord = require("discord.js");

module.exports = class Help {
	static async handle(msg, args) {
		var embed = new Discord.RichEmbed()
			.setColor("#4CABFE")
			.addField("Flash Commands", "Enter `!flash <command>` for detailed syntax info")
			.addField("guild", "Information about this guild")
			.addField("roles", "Commands for managing roles")
			.addField("ahaa", "Spit out random Flash (Queen) lyrics");
		msg.channel.send(embed);
	}
};
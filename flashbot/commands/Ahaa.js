const Discord = require("discord.js");

module.exports = class Help {
	static async handle(msg, args) {
		var lyrics = [
			"Flash! Ah-ah",
			"Savior of the universe",
			"He'll save everyone of us",
			"He's a miracle",
			"King of the impossible",
			"He's for every one of us",
			"Stands for every one of us",
			"He saves with a mighty hand",
			"Every man, every woman, every child, it's the mighty Flash",
		];
		
		msg.channel.send(":musical_note: **" + lyrics[Math.floor(Math.random() * lyrics.length)] + "** :musical_note:");
	}
};
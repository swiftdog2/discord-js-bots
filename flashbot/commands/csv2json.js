const csv = require('csvtojson');

module.exports = class csv2json {
	static async handle(msg, args) {
		if(args.length == 0)
			throw new Error("Requires input file e.g `!flash csv2json <input.csv>`");
		
		console.log("Converting CSV to JSON");

		return csv().fromFile(args[0]);
	}
};

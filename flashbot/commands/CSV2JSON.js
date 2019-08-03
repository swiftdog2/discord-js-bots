const csv=require('csvtojson');

module.exports = class CSV2JSON {
	static async handle(args) {
		console.log("Running handler for CSV2JSON");
		
		if(args.length == 0) {
			throw new Error("Requires input file e.g `!flash csv2json <input.csv>`");
		}
		
		console.log("Converting CSV to JSON");

		return csv().fromFile(args[0]);
	}
};
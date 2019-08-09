const csv = require('csvtojson');

module.exports = class CSV2JSON {
	static async handle(msg, args) {
		if(args.length == 0)
			throw new Error("Requires input file e.g `!flash csv2json <input.csv>`");
		
		console.log("Converting CSV to JSON");
		
		let result = await csv().fromFile(args[0]);
		
		return new Promise((resolve, reject) => {
			resolve(JSON.stringify(result));
		});
	}
};

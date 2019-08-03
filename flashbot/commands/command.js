module.exports = class command {
	static async handle(msg, args) {
		if(args.length == 0)
			throw new Error("Invalid arguments specified.");
		
		return 0;
	}
};
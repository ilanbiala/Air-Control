module.exports = {
	db: {
		host: 'localhost',
		database: 'development'
	},
	app: {
		environment: 'development',
		name: 'Node CMS - Dev',
		port: process.env.PORT || 3000
	}
};

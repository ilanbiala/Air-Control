module.exports = {
	db: {
		host: 'localhost',
		database: 'production'
	},
	app: {
		environment: 'production',
		name: 'Node CMS',
		port: process.env.PORT || 80
	}
};

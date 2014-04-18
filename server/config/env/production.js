module.exports = {
	db: {
		host: 'localhost',
		database: 'aircontrol'
	},
	app: {
		environment: 'production',
		name: 'Node CMS',
		port: process.env.PORT || 80
	}
};

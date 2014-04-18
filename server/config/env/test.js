module.exports = {
	db: {
		host: 'localhost',
		database: 'aircontrol-test'
	},
	app: {
		environment: 'test',
		name: 'Node CMS - Test',
		port: process.env.PORT || 3000
	}
};

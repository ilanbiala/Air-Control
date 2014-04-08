module.exports = {
	db: {
		host: 'localhost',
		database: 'test'
	},
	app: {
		environment: 'test',
		name: 'Node CMS - Test',
		port: process.env.PORT || 3000
	}
};
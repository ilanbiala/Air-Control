module.exports = {
	db: 'mongodb://localhost/dev',
	app: {
		environment: 'development',
		name: 'Node CMS - Dev',
		port: process.env.PORT || 3000
	}
};

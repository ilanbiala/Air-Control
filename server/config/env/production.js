module.exports = {
	db: 'mongodb://localhost/production',
	app: {
		environment: 'production',
		name: 'Node CMS',
		port: process.env.PORT || 80
	}
};

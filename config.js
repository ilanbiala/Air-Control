var config = {
	development: {
		environment: 'development',
		port: 3000
	},
	production: {
		environment: 'production',
		port: 80
	}
};

module.exports = function(mode) {
	return config[mode || process.argv[2] || 'development'] || config.development;
};
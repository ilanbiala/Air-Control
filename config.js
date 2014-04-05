module.exports = function(mode) {
	var envConfig = require('./config/' + (mode || process.env.NODE_ENV || 'development'));
	return {
		db: envConfig.db,
		app: {
			environment: envConfig.app.environment,
			name: envConfig.app.name,
			port: envConfig.app.port
		},
		routes: {
			admin: {
				panel: {
					url: '/panel',
					page: 'admin/panel.html',
					locals: {
						title: 'CMS Admin Dashboard'
					}
				},
				users: {
					url: '/panel/users',
					page: 'admin/users.html',
					locals: {
						title: 'CMS Admin Dashboard | Users',
						users: [{
							name: 'John',
							permissions: 'superuser'
						}, {
							name: 'Jane',
							permissions: 'admin'
						}]
					}
				},
				settings: {
					url: '/panel/settings',
					page: 'admin/settings.html',
					locals: {
						title: 'CMS Admin Dashboard | Settings'
					}
				},
			}
		}
	};
};

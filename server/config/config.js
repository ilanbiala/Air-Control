var path = require('path');

module.exports = function(mode) {
	var env = (mode || process.env.NODE_ENV || 'development');
	var envConfig = require('./env/' + env);
	var rootPath = path.normalize(__dirname + '/../..');

	return {
		db: envConfig.db,
		app: envConfig.app,
		root: rootPath,
		routes: {
			home: {
				url: '/',
				page: 'index.html',
				locals: {
					title: 'Node CMS | Home'
				}
			},
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
							permissions: 'superuser',
							_id: 'abc'
						}, {
							name: 'Jane',
							permissions: 'admin',
							_id: 'def'
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
			},
			error: {
				notFound: {
					url: '/404',
					page: '404.html',
					locals: {

					}
				},
				server: {
					url: '/500',
					page: '500.html',
					locals: {

					}
				}
			}
		}
	};
};
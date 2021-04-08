module.exports = {

	development: {
		client: 'pg',
		connection: process.env.DB_URL,

		connection: {
			host : '127.0.0.1',
			user : 'postgres',
			password : 'pato',
			database : 'postgres'
		},

		migrations: {
			tableName: 'knex_migrations',
			directory: './src/database/migrations'
		},

		seeds: {
			directory: './src/database/seeds',
		},
	},

	staging: {
		client: 'pg',
		connection: {
			database: 'my_db',
			user:     'username',
			password: 'password'
		},
		pool: {
			min: 2,
			max: 10
		},
		migrations: {
			tableName: 'knex_migrations'
		}
	},

	production: {
		client: 'pg',
		connection: {
			database: 'my_db',
			user:     'username',
			password: 'password'
		},
		pool: {
			min: 2,
			max: 10
		},
		migrations: {
			tableName: 'knex_migrations'
		}
	}

};

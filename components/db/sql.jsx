import postgres from "postgres";

export const sql = postgres({
	host: process.env.DB_HOST, // Postgres ip address[es] or domain name[s]
	port: process.env.DB_PORT, // Postgres server port[s]
	database: process.env.DB_NAME, // Name of database to connect to
	username: process.env.DB_USERNAME, // Username of database user
	password: process.env.DB_PASSWORD, // Password of database user
	ssl: false, // true, prefer, require, tls.connect options
	max: 20, // Max number of connections
	max_lifetime: null, // Max lifetime in seconds (more info below)
	idle_timeout: 60, // Idle connection timeout in seconds
	connect_timeout: 30, // Connect timeout in seconds
});

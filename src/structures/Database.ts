import { ConnectionManager } from 'typeorm';
import { Settings } from '../models/Settings';
import dbConfig from '../config/dbConfig';

const connectionManager = new ConnectionManager();
connectionManager.create({
	logging: false,
	synchronize: true,
	name: dbConfig.databaseName,
	database: dbConfig.databaseName,
	password: dbConfig.databasePassword,
	type: 'mariadb',
	host: dbConfig.databaseHostname,
	port: dbConfig.databasePort,
	username: dbConfig.databaseUser,
	entities: [Settings],
});

export default connectionManager;

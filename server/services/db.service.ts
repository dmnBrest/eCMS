import { IMain, IDatabase } from 'pg-promise';
import { appConfig } from './../config';
import * as pgPromise from 'pg-promise';
import * as Sequelize from 'sequelize';

let pgp:IMain = pgPromise({
	// Initialization Options
	query: (e) => {
		console.log('Query:');
		console.log(e.query);
	}
});

export const db:IDatabase<any> = pgp(appConfig.dbPath);

export const sequelize = new Sequelize(appConfig.dbPath);

sequelize
	.authenticate()
	.then(() => {
		console.log('Sequelize: Connection has been established successfully.');
	})
	.catch(err => {
		console.error('Sequelize: Unable to connect to the database:', err);
	});
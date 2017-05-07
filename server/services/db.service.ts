import { IMain, IDatabase } from 'pg-promise';
import { appConfig } from './../config';
import * as pgPromise from 'pg-promise';

// https://github.com/vitaly-t/pg-promise/tree/master/typescript
// https://github.com/vitaly-t/pg-promise-demo/blob/master/TypeScript/db/index.ts

let pgp:IMain = pgPromise({
	// Initialization Options
	query: (e) => {
		console.log('Query:');
		console.log(e.query);
	}
});

let cn:string = appConfig.dbPath;
let db:IDatabase<any> = pgp(cn);

export = db;
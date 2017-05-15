import * as db from './db.service';

const OBJECTS_AVAILABLE = ['user', 'topic'];

// export async function getObjects(objType:string, page: number, perPage: number):Promise<any> {
// 	if (OBJECTS_AVAILABLE.indexOf(objType) < 0) {
// 		throw '"'+objType+'" Object not found.';
// 	}
// 	let orderBy = 'id DESC';
// 	if (objType == 'user') {
// 		objType = 'public.user';
// 	}
// 	if (objType == 'topic') {
// 		orderBy = '"order"'
// 	}
// 	try {
// 		let objects:any[] = await db.query('SELECT * FROM $1:raw ORDER BY $2:raw LIMIT $3 OFFSET $4', [objType, orderBy, perPage, (page-1)*perPage]);
// 		console.log('ObjectService.getObjects:');
// 		return objects;
// 	} catch(err) {
// 		console.log(err);
// 		throw err;
// 	};
// }

export async function getTotalObjects(objType:string):Promise<number> {
	if (OBJECTS_AVAILABLE.indexOf(objType) < 0) {
		throw '"'+objType+'" Object not found.';
	}
	if (objType == 'user') {
		objType = 'public.user';
	}
	try {
		let res = await db.one('SELECT COUNT(id) FROM $1:raw', [objType]);
		console.log('ObjectService.getTotalObjects:');
		console.log(res);
		return res.count;
	} catch(err) {
		console.log(err);
		throw err;
	};
}

export async function getObjectById(objType:string, id:number):Promise<any> {
	if (OBJECTS_AVAILABLE.indexOf(objType) < 0) {
		throw '"'+objType+'" Object not found.';
	}
	if (objType == 'user') {
		objType = 'public.user';
	}
	try {
		let obj = await db.one('SELECT * FROM $1:raw WHERE id=$2', [objType, id]);
		console.log('ObjectService.getObjectById:');
		console.log(obj);
		return obj;
	} catch(err) {
		console.log(err);
		throw err;
	};
}
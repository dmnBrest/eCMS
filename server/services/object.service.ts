import { db } from './db.service';

const OBJECTS_AVAILABLE = ['user', 'topic'];

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
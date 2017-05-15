import * as bcrypt from 'bcrypt';
import { v4 as uuidV4} from 'uuid';
import * as db from './db.service';
import * as I from './../interfaces';

export async function getTopics(page: number, perPage: number):Promise<I.ITopic[]> {
	try {
		let users:I.ITopic[] = await db.query('SELECT * FROM topic ORDER BY "order" ASC LIMIT $1 OFFSET $2', [perPage, (page-1)*perPage]);
		console.log('TopicService.getTopics:');
		return users;
	} catch(err) {
		console.log(err);
		throw err;
	};
}

export async function saveTopic(topic:I.ITopic): Promise<number> {
	topic.slug = topic.title;
	try {
		let res:any;
		if (!topic.id) {
			res = await db.one('INSERT INTO topic ("title", "order", "slug") VALUES(${title}, ${order}, ${slug}) RETURNING id', topic);
		} else {
			res = await db.one('UPDATE topic SET "title"=${title}, "order"=${order} WHERE id=${id} RETURNING id', topic);
		}
		console.log('TopicService.saveTopic:');
		console.log(res);
		return res.id;
	} catch(err) {
		console.log(err);
		throw err;
	};
}

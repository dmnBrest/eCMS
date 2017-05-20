import * as bcrypt from 'bcrypt';
import { v4 as uuidV4} from 'uuid';
import { db } from './db.service';
import * as I from './../interfaces';
import * as Slug from 'slug';

export async function getTopics(page: number, perPage: number, withHidden: boolean):Promise<I.ITopic[]> {
	try {
		let whereNotHidden = 'WHERE is_hidden IS FALSE';
		if (withHidden) {
			whereNotHidden = '';
		}
		let topics:I.ITopic[] = await db.query('SELECT * FROM topic '+whereNotHidden+' ORDER BY "order" ASC LIMIT $1 OFFSET $2', [perPage, (page-1)*perPage]);
		console.log('TopicService.getTopics:');
		console.log(topics);
		return topics;
	} catch(err) {
		console.log(err);
		throw err;
	};
}

export async function getTopicBySlug(slug: string):Promise<I.ITopic> {
	try {
		let topic:I.ITopic = await db.one('SELECT * FROM topic WHERE slug=$1', [slug])
		console.log('TopicService.getTopicBySlug:');
		console.log(topic);
		return topic;
	} catch(err) {
		console.log(err);
		throw err;
	};
}

export async function saveTopic(topic:I.ITopic): Promise<number> {
	topic.slug = Slug(topic.title, {lower: true});

	// TODO: count total posts

	try {
		let res:any;
		if (!topic.id) {
			res = await db.one('INSERT INTO topic ("title", "order", "slug", "image_ids", "is_hidden") VALUES(${title}, ${order}, ${slug}, ${image_ids}::integer[], ${is_hidden}) RETURNING id', topic);
		} else {
			res = await db.one('UPDATE topic SET "title"=${title}, "order"=${order}, "slug"=${slug}, "image_ids"= ${image_ids}::integer[], "is_hidden"=${is_hidden} WHERE id=${id} RETURNING id', topic);
		}
		console.log('TopicService.saveTopic:');
		console.log(res);
		return res.id;
	} catch(err) {
		console.log(err);
		throw err;
	};
}

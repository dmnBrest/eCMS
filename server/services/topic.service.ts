import * as bcrypt from 'bcrypt';
import { v4 as uuidV4} from 'uuid';
import { Topic } from './db.service';
import * as I from './../interfaces';
import * as Slug from 'slug';

export async function getTopics(page: number, perPage: number, withHidden: boolean):Promise<I.TopicInstance[]> {
	let topics:I.TopicInstance[];
	// let whereNotHidden = 'WHERE is_hidden IS FALSE';
	// if (withHidden) {
	// 	whereNotHidden = '';
	// }
	//let topics:I.TopicInstance[] = await db.query('SELECT * FROM topic '+whereNotHidden+' ORDER BY "order" ASC LIMIT $1 OFFSET $2', [perPage, (page-1)*perPage]);
	let options:any = {
		offset: (page-1)*perPage,
		limit: perPage,
		order: '"order" ASC'
	}

	if (!withHidden) {
		options.where = {
			is_hidden: false
		}
	}
	try {
		topics = await Topic.findAll(options);
	} catch(err) {
		console.log(err);
		throw I.INTERNAL_ERROR;
	};
	return topics;

}

export async function getTopicBySlug(slug: string):Promise<I.TopicInstance> {
	let topic:I.TopicInstance;
	try {
		//let topic:I.TopicInstance = await db.one('SELECT * FROM topic WHERE slug=$1', [slug])
		topic = await Topic.findOne({
			where: {
				slug: slug
			}
		});
	} catch(err) {
		console.log(err);
		throw I.INTERNAL_ERROR;
	};
	return topic;
}

export async function saveTopic(topicObj:I.ITopic): Promise<I.TopicInstance> {

	// TODO: count total posts

	let topic = Topic.build(topicObj);
	topic.slug = Slug(topic.title, {lower: true});
	try {

		// TODO Check all possible issues with currentUser/fields

		await topic.save()
	} catch(err) {
		console.log(err);
		throw I.INTERNAL_ERROR;
	};

	return topic;
}

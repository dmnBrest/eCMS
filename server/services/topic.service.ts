import * as bcrypt from 'bcrypt';
import { v4 as uuidV4} from 'uuid';
import { Topic, Post } from './db.service';
import * as I from './../interfaces';
import * as Slug from 'slug';

export async function getTopicById(id: string): Promise<I.TopicInstance> {
	let topic:I.TopicInstance;
	try {
		topic = await Topic.findById(id);
	} catch(err) {
		console.log(err);
		throw I.INTERNAL_ERROR;
	};
	return topic;
}

export async function getTopics(page: number, perPage: number, withHidden: boolean):Promise<I.TopicInstance[]> {
	let topics:I.TopicInstance[];
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

export async function updateTotals(id: string): Promise<I.TopicInstance> {
	let topic:I.TopicInstance;
	try {
		topic = await Topic.findOne({
			where: {
				id: id
			},
			include: [{model: Post}],
			order: [
				[Post, 'created_at', 'DESC']
			]
		});
		let totalPosts = topic.Posts.length;
		topic.total_posts = totalPosts;
		if (totalPosts > 0) {
			topic.last_post_id = topic.Posts[0].id;
		}
		topic.save();
	} catch(err) {
		console.log(err);
		throw I.INTERNAL_ERROR;
	};
	return topic;
}

export async function getTopicBySlug(slug: string):Promise<I.TopicInstance> {
	let topic:I.TopicInstance;
	try {
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

	let topic: I.TopicInstance;
	if (topicObj.id) {
		topic = await Topic.findById(topicObj.id);
		topic.updateAttributes(topicObj);
	} else {
		topic = Topic.build(topicObj);
	}

	topic.slug = Slug(topic.title, {lower: true});

	// TODO: count total posts

	try {
		await topic.save()
	} catch(err) {
		console.log(err);
		throw I.INTERNAL_ERROR;
	};

	return topic;
}

import { v4 as uuidV4} from 'uuid';
import * as Slug from 'slug';
import { Post, Topic, Comment }  from './db.service';
import * as I from './../interfaces';
import * as TopicService from './topic.service';

export async function getPostById(id: string): Promise<I.PostInstance> {
	let post:I.PostInstance;
	try {
		post = await Post.findById(id);
	} catch(err) {
		console.log(err);
		throw I.INTERNAL_ERROR;
	};
	return post;
}

export async function getPostsByTopicId(topicId: string): Promise<I.PostInstance[]> {
	let posts:I.PostInstance[];
	try {
		posts = await Post.findAll({
			where: {
				topic_id: topicId
			}
		});
	} catch(err) {
		console.log(err);
		throw I.INTERNAL_ERROR;
	};
	return posts;
}

export async function getPostBySlug(slug: string): Promise<I.PostInstance> {
	let post:I.PostInstance;
	try {
		post = await Post.findOne({
			where: {
				slug: slug
			},
			include: [
				{model: Topic}
			]
		});
	} catch(err) {
		console.log(err);
		throw I.INTERNAL_ERROR;
	};
	return post;
}

export async function savePost(postObj:I.IPost, user:I.IUser): Promise<I.PostInstance> {

	let post;
	if (postObj.id) {
		try {
			post = await Post.findOne(postObj.id);
			if (post == null) {
				throw 'Post with ID "'+postObj.id+'" not found';
			}
			if (post.user_id != user.id) {
				throw 'Permission denied';
			}
		} catch(err) {
			console.log(err);
			throw I.INTERNAL_ERROR;
		}
	} else {
		post = Post.build({});
		post.user_id = user.id;
		post.topic_id = postObj.topic_id;
	}

	post.title = postObj.title;
	post.body_raw = postObj.body_raw;

	// TODO: check for slug duplicates
	if (!post.slug) {
		post.slug = Slug(post.title, {lower: true});
	}

	post.body_html = bodyToHtml(post.body_raw);

	if (user.is_writer) {
		post.keywords = postObj.keywords;
		post.description = postObj.description;
	}

	post.image_ids = postObj.image_ids;

	// TODO: count total related posts
	post.total_comments = 0;

	let totalComments:number = 0;
	if (post.id) {
		try {
			totalComments = await Comment.count({
				where: {
					post_id: post.id
				}
			});
		} catch(err) {
			console.log(err);
			throw I.INTERNAL_ERROR;
		}
	}

	try {
		await post.save();
	} catch(err) {
		console.log(err);
		throw I.INTERNAL_ERROR;
	};

	TopicService.updateTotals(post.topic_id);

	return post;
}

export async function generatePreview(post:I.IPost): Promise<I.IPost> {

	try {

		post.body_html = bodyToHtml(post.body_raw);

		return post;
	} catch(err) {
		console.log(err);
		throw err;
	};
}

function bodyToHtml(bbStr: string): string {

	//TODO BBCode -> HTML

	return bbStr;
}
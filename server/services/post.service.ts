import { v4 as uuidV4} from 'uuid';
import * as Slug from 'slug';
import { Post, Topic, Comment }  from './db.service';
import * as I from './../interfaces';
import * as TopicService from './topic.service';
import { BBCodesParser } from './bbcode.service';

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
			},
			order: 'created_at DESC'
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

	console.log('FFFFF');
	console.log(postObj);


	let post;
	if (postObj.id) {
		try {
			post = await Post.findById(postObj.id);
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

	// GENERATE SLUG
	let slug =  Slug(post.title, {lower: true});
	let counter = 1;
	let availableSlugs: I.UserInstance[];
	try {
		availableSlugs = await Post.findAll({
			where: {
				slug: {
					$like: slug+'%'
				}
			}
		});
	} catch(err) {
		console.log(err);
		throw I.INTERNAL_ERROR;
	}

	let slugSet = new Set();
	for (let s of availableSlugs) {
		slugSet.add(s.slug);
	}
	let originalSlug = slug;
	while(slugSet.has(slug)) {
		slug = originalSlug + '-' + counter;
		counter++;
	}
	// END GENERATE SLUG

	post.slug = Slug(slug, {lower: true});

	let res:I.IBBCodeRarserResponse;
	try {
		res = bodyToHtml(post.body_raw);
	} catch(err) {
		console.log(err);
		throw I.INTERNAL_ERROR;
	}

	if (res.error) {
		console.log(res.errorQueue);
		throw res.errorQueue;
	}
	post.body_html = res.html

	// WRITER
	if (user.is_writer) {
		post.keywords = postObj.keywords;
		post.description = postObj.description;
		post.show_in_blog = postObj.show_in_blog;
	}

	post.image_ids = postObj.image_ids;

	try {
		await post.save();
	} catch(err) {
		console.log(err);
		throw I.INTERNAL_ERROR;
	};

	updateTotals(post.id);
	TopicService.updateTotals(post.topic_id);

	return post;
}

export async function updateTotals (postId: string) {

	let post:I.PostInstance;
	try {
		post = await Post.findOne({
			where: {
				id: postId
			},
			include: [{model: Comment}],
			order: [
				[Comment, 'created_at', 'DESC']
			]
		});
		let totalComments = post.Comments.length;

		post.total_comments = totalComments;
		if (totalComments > 0) {
			post.last_comment_id = post.Comments[0].id;
		}
		post.save();
	} catch(err) {
		console.log(err);
		throw I.INTERNAL_ERROR;
	};
	return post;
}

export async function generatePreview(post:I.IPost): Promise<I.IBBCodeRarserResponse> {
	try {
		let res = bodyToHtml(post.body_raw);
		return res;
	} catch(err) {
		console.log(err);
		throw err;
	};
}

function bodyToHtml(bbStr: string): I.IBBCodeRarserResponse {

	var result = BBCodesParser.process({
		text: bbStr,
		removeMisalignedTags: false,
		addInLineBreaks: true
	});
	if (result.error) {
		console.error("Errors", result.error);
		console.dir(result.errorQueue);
	}
	console.log(result.html);  //=> <span class="xbbcode-b">Hello world</span>

	return result;
}
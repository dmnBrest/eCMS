import { v4 as uuidV4} from 'uuid';
import * as db from './db.service';
import * as I from './../interfaces';
import * as Slug from 'slug';

export async function savePost(post:I.IPost, user:I.IUser): Promise<I.IPost> {

	post.slug = Slug(post.title, {lower: true});

	post = bodyToHtml(post);

	// TODO: check for slug duplicates

	// TODO: count total related posts

	try {
		let res:any;
		if (!post.id) {
			post.created_at = Math.floor(Date.now() / 1000);
			post.user_id = user.id;
			post.total_posts = 0;
			let q:string;
			if (user.is_writer) {
				// WRITER
				q = `
				INSERT INTO post (
					"title",
					"body_raw",
					"body_html",
					"slug",
					"image_ids",
					"created_at",
					"user_id",
					"topic_id",
					"total_posts",
					"keywords",
					"description"
				)
				VALUES(
					\${title},
					\${body_raw},
					\${body_html},
					\${slug},
					\${image_ids}::integer[],
					\${created_at},
					\${user_id},
					\${topic_id},
					\${total_posts},
					\${keywords},
					\${description}
				)
				RETURNING id`
			} else {
				// REGULAR USER
				q = `
				INSERT INTO post (
					"title",
					"body_raw",
					"body_html",
					"slug",
					"image_ids",
					"created_at",
					"user_id",
					"topic_id",
					"total_posts"
				)
				VALUES(
					\${title},
					\${body_raw},
					\${body_html},
					\${slug},
					\${image_ids}::integer[],
					\${created_at},
					\${user_id},
					\${topic_id},
					\${total_posts}
				)
				RETURNING id`
			}
			res = await db.one(q, post);
		} else {
			res = await db.one(`
				UPDATE topic SET
					"title"=\${title},
					"slug"=\${slug},
					"image_ids"=\${image_ids}::integer[]
				WHERE id=\${id}
				RETURNING id`, post);
		}
		console.log('PostService.savePost:');
		console.log(res);
		post.id = res.id;
		return post;
	} catch(err) {
		console.log(err);
		throw err;
	};
}

export async function generatePreview(post:I.IPost): Promise<I.IPost> {

	try {

		post = bodyToHtml(post);

		return post;
	} catch(err) {
		console.log(err);
		throw err;
	};
}

function bodyToHtml(post: I.IPost) {

	//TODO BBCode -> HTML

	post.body_html = post.body_raw;
	return post;
}
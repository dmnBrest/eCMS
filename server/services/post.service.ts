import { v4 as uuidV4} from 'uuid';
import { Post }  from './db.service';
import * as I from './../interfaces';
import * as Slug from 'slug';

export async function savePost(postObj:I.IPost, user:I.IUser): Promise<I.PostInstance> {

	let post = Post.build(postObj);

	post.slug = Slug(post.title, {lower: true});
	post.body_html = bodyToHtml(post.body_raw);

	// TODO: check for slug duplicates

	// TODO: count total related posts

	post.user_id = user.id;
	post.total_posts = 0;

	// if (user.is_writer) {
	// 	// WRITER
	// 	q = `
	// 	INSERT INTO post (
	// 		"title",
	// 		"body_raw",
	// 		"body_html",
	// 		"slug",
	// 		"image_ids",
	// 		"created_at",
	// 		"user_id",
	// 		"topic_id",
	// 		"total_posts",
	// 		"keywords",
	// 		"description"
	// 	)
	// 	VALUES(
	// 		\${title},
	// 		\${body_raw},
	// 		\${body_html},
	// 		\${slug},
	// 		\${image_ids}::integer[],
	// 		\${created_at},
	// 		\${user_id},
	// 		\${topic_id},
	// 		\${total_posts},
	// 		\${keywords},
	// 		\${description}
	// 	)
	// 	RETURNING id`
	// } else {
	// 	// REGULAR USER
	// 	q = `
	// 	INSERT INTO post (
	// 		"title",
	// 		"body_raw",
	// 		"body_html",
	// 		"slug",
	// 		"image_ids",
	// 		"created_at",
	// 		"user_id",
	// 		"topic_id",
	// 		"total_posts"
	// 	)
	// 	VALUES(
	// 		\${title},
	// 		\${body_raw},
	// 		\${body_html},
	// 		\${slug},
	// 		\${image_ids}::integer[],
	// 		\${created_at},
	// 		\${user_id},
	// 		\${topic_id},
	// 		\${total_posts}
	// 	)
	// 	RETURNING id`
	// }

	// UPDATE topic SET
	// 	"title"=\${title},
	// 	"slug"=\${slug},
	// 	"image_ids"=\${image_ids}::integer[]
	// WHERE id=\${id}
	// RETURNING id
	try {
		await post.save();
	} catch(err) {
		console.log(err);
		throw I.INTERNAL_ERROR;
	};
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
import { v4 as uuidV4} from 'uuid';
import * as Slug from 'slug';
import { Comment }  from './db.service';
import * as I from './../interfaces';

export async function getComments(postId: string): Promise<I.CommentInstance[]> {
	let comments:I.CommentInstance[];
	try {
		comments = await Comment.findAll({
			where: {
				post_id: postId
			}
		});
	} catch(err) {
		console.log(err);
		throw I.INTERNAL_ERROR;
	};
	return comments;
}

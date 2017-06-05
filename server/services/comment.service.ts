import { v4 as uuidV4} from 'uuid';
import * as Slug from 'slug';
import { Comment }  from './db.service';
import * as I from './../interfaces';
import { BBCodesParser } from './bbcode.service';

export async function getPostComments(postId: string): Promise<I.CommentInstance[]> {
	let comments:I.CommentInstance[];
	try {
		comments = await Comment.findAll({
			where: {
				post_id: postId
			},
			order: 'created_at ASC'
		});
	} catch(err) {
		console.log(err);
		throw I.INTERNAL_ERROR;
	};
	return comments;
}

export async function getCommentById(id: string): Promise<I.PostInstance> {
	let comment:I.CommentInstance;
	try {
		comment = await Comment.findById(id);
	} catch(err) {
		console.log(err);
		throw I.INTERNAL_ERROR;
	};
	return comment;
}

export async function saveComment(commentObj:I.IComment, user:I.IUser): Promise<I.CommentInstance> {

	let comment;
	if (commentObj.id) {
		try {
			comment = await Comment.findById(commentObj.id);
			if (comment == null) {
				throw 'Post with ID "'+commentObj.id+'" not found';
			}
			if (comment.user_id != user.id) {
				throw 'Permission denied';
			}
		} catch(err) {
			console.log(err);
			throw I.INTERNAL_ERROR;
		}
	} else {
		comment = Comment.build({});
		comment.user_id = user.id;
		comment.post_id = commentObj.post_id;
	}

	comment.body_raw = commentObj.body_raw;

	let res:I.IBBCodeRarserResponse;
	try {
		res = bodyToHtml(comment.body_raw);
	} catch(err) {
		console.log(err);
		throw I.INTERNAL_ERROR;
	}

	if (res.error) {
		console.log(res.errorQueue);
		throw res.errorQueue;
	}
	comment.body_html = res.html;

	try {
		await comment.save();
	} catch(err) {
		console.log(err);
		throw I.INTERNAL_ERROR;
	};

	//PostService.updateTotals(comment.post_id);

	return comment;
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


import { Router, Request, Response, NextFunction } from 'express';
import * as CommentService from './../services/comment.service';
import { isLoggedIn } from './../services/security.service';
import * as I from './../interfaces';

class Comment {

	public async getComment(req: Request, resp: Response, next?: NextFunction) {

		resp.setHeader('Content-Type', 'application/json');

		let commentId = req.body.commentId;

		let comment:I.IPost;
		try {
			comment = await CommentService.getCommentById(commentId);
			if (comment == null) {
				throw 'Post not found';
			}
		} catch(err) {
			console.log();
			resp.status(500).json({ status: I.ResultStatus.ERROR, errors: [I.INTERNAL_ERROR] } as I.IResults);
			return;
		}

		resp.json({ status: I.ResultStatus.SUCCESS, payload: comment} as I.IResults);

	}


	public async save(req: Request, resp: Response, next?: NextFunction) {

		resp.setHeader('Content-Type', 'application/json');

		let comment = req.body as I.IComment

		if (
			!comment.body_raw ||
			!comment.post_id
		) {
			resp.status(400).send({ status: I.ResultStatus.ERROR, errors: ['Bad Request'] } as I.IResults);
			return;
		}

		try {
			comment = await CommentService.saveComment(comment, req.user);
		} catch(err) {

			if (err == I.INTERNAL_ERROR) {
				resp.status(500).json({ status: I.ResultStatus.ERROR, errors: [I.INTERNAL_ERROR] } as I.IResults);
				return;
			} else {
				err = [].concat( err );
				resp.status(400).json({ status: I.ResultStatus.ERROR, errors: err } as I.IResults);
			}
			return;
		}

		resp.json({ status: I.ResultStatus.SUCCESS, payload: comment} as I.IResults);

	}

}

const comment = new Comment();

export const CommentRouter = Router();
CommentRouter.post('/save', isLoggedIn, comment.save);
CommentRouter.post('/get', isLoggedIn, comment.getComment);

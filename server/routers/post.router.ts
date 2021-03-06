import { Router, Request, Response, NextFunction } from 'express';
import * as PostService from './../services/post.service';
import { isLoggedIn } from './../services/security.service';
import * as I from './../interfaces';

class Post {

	public async getPost(req: Request, resp: Response, next?: NextFunction) {

		resp.setHeader('Content-Type', 'application/json');

		let postId = req.body.postId;

		let post:I.IPost;
		try {
			post = await PostService.getPostById(postId);
			if (post == null) {
				throw 'Post not found';
			}
		} catch(err) {
			console.log();
			resp.status(500).json({ status: I.ResultStatus.ERROR, errors: [I.INTERNAL_ERROR] } as I.IResults);
			return;
		}

		resp.json({ status: I.ResultStatus.SUCCESS, payload: post} as I.IResults);

	}


	public async save(req: Request, resp: Response, next?: NextFunction) {

		resp.setHeader('Content-Type', 'application/json');

		let post = req.body as I.IPost

		if (
			!post.title ||
			post.title.length > 255 ||
			!post.body_raw ||
			!post.topic_id
		) {
			resp.status(400).send({ status: I.ResultStatus.ERROR, errors: ['Bad Request'] } as I.IResults);
			return;
		}

		try {
			post = await PostService.savePost(post, req.user);
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

		resp.json({ status: I.ResultStatus.SUCCESS, payload: post} as I.IResults);

	}

	public async generatePreview(req: Request, resp: Response, next?: NextFunction) {

		resp.setHeader('Content-Type', 'application/json');

		let post = req.body as I.IPost

		let res:I.IBBCodeRarserResponse;
		try {
			res = await PostService.generatePreview(post);
		} catch(err) {
			resp.status(500).json({ status: I.ResultStatus.ERROR, errors: [I.INTERNAL_ERROR] } as I.IResults);
			return;
		}

		resp.json({ status: I.ResultStatus.SUCCESS, payload: res} as I.IResults);

	}

}

const post = new Post();

export const PostRouter = Router();
PostRouter.post('/save', isLoggedIn, post.save);
PostRouter.post('/get', isLoggedIn, post.getPost);
PostRouter.post('/generate-preview', isLoggedIn, post.generatePreview);
import { Router, Request, Response, NextFunction } from 'express';
import * as PostService from './../services/post.service';
import { isLoggedIn } from './../services/security.service';
import * as I from './../interfaces';

class Post {

	public async save(req: Request, resp: Response, next?: NextFunction) {

		resp.setHeader('Content-Type', 'application/json');

		let post = req.body as I.IPost

		if (
			!post.title ||
			post.title.length > 255 ||
			!post.body_raw
		) {
			resp.status(400).send({ status: I.ResultStatus.ERROR, errors: ['Bad Request'] } as I.IResults);
			return;
		}

		try {
			post = await PostService.savePost(post, req.user);
		} catch(err) {
			resp.status(500).json({ status: I.ResultStatus.ERROR, errors: [I.INTERNAL_ERROR] } as I.IResults);
			return;
		}

		resp.json({ status: I.ResultStatus.SUCCESS, payload: post} as I.IResults);

	}

	public async generatePreview(req: Request, resp: Response, next?: NextFunction) {

		resp.setHeader('Content-Type', 'application/json');

		let post = req.body as I.IPost

		try {
			post = await PostService.generatePreview(post);
		} catch(err) {
			resp.status(500).json({ status: I.ResultStatus.ERROR, errors: [I.INTERNAL_ERROR] } as I.IResults);
			return;
		}

		resp.json({ status: I.ResultStatus.SUCCESS, payload: post.body_html} as I.IResults);

	}

}

const post = new Post();

export const PostRouter = Router();
PostRouter.post('/save', isLoggedIn, post.save);
PostRouter.post('/generate-preview', isLoggedIn, post.generatePreview);
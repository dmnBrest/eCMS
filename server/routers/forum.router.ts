import { Router, Request, Response, NextFunction } from 'express';
import * as path from 'path';
import * as fs from 'fs';

class Forum {

	public index(req: Request, res: Response, next?: NextFunction) {

		res.render('forum.index.html', {});
	}

}

const forum = new Forum();

export const ForumRouter = Router();
ForumRouter.get('/', forum.index);
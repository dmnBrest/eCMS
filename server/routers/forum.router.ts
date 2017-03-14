import { Router, Request, Response, NextFunction } from 'express';
import * as path from 'path';
import * as fs from 'fs';
import * as db from './../db';

class Forum {

	public index(req: Request, res: Response, next?: NextFunction) {

		db.any('select * from public.user where username=$1', ['doom1'])
		.then(data => {
			console.log(data);
		})
		.catch(error => {
			console.log(error);
		});

		res.render('forum/index.html', {});
	}

}

const forum = new Forum();

export const ForumRouter = Router();
ForumRouter.get('/', forum.index);
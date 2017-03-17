import { Router, Request, Response, NextFunction } from 'express';
import * as path from 'path';
import * as fs from 'fs';
import * as db from './../db';

class Auth {

	public index(req: Request, res: Response, next?: NextFunction) {

		db.any('select * from public.user where username=$1', ['doom1'])
		.then(data => {
			console.log(data);
		})
		.catch(error => {
			console.log(error);
		});

		res.render('auth.index.html', {});
	}

}

const auth = new Auth();

export const AuthRouter = Router();
AuthRouter.get('/', auth.index);

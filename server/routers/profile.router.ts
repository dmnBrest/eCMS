import { Router, Request, Response, NextFunction } from 'express';
import * as path from 'path';
import * as fs from 'fs';
import * as db from './../db';

class Profile {

	public index(req: Request, res: Response, next?: NextFunction) {

		db.any('select * from public.user where username=$1', ['doom1'])
		.then(data => {
			console.log(data);
		})
		.catch(error => {
			console.log(error);
		});

		res.render('profile/index.html', {});
	}

}

const profile = new Profile();

export const ProfileRouter = Router();
ProfileRouter.get('/', profile.index);
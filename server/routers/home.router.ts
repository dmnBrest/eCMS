import { Router, Request, Response, NextFunction } from 'express';
import * as path from 'path';
import * as fs from 'fs';
import * as db from './../db';

class Home {

	public index(req: Request, res: Response, next?: NextFunction) {

		db.any('select * from public.user where username=$1', ['doom1'])
		.then(data => {
			console.log(data);
		})
		.catch(error => {
			console.log(error);
		});

		res.render('home/index.html', {});
	}

}

const home = new Home();

export const HomeRouter = Router();
HomeRouter.get('/', home.index);
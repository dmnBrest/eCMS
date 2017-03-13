import { Router, Request, Response, NextFunction } from 'express';
import * as path from 'path';
import * as fs from 'fs';
import { AppConfig, IConfig } from './../config';
//import { LocalsInterface } from './../server';

class Auth {

	public index(req: Request, res: Response, next?: NextFunction) {

		let config = AppConfig.getInstance();
		console.log(config);

		res.render('auth/index.html', {});
	}

}

const auth = new Auth();

export const AuthRouter = Router();
// AppsManagerRouter.get('/', manager.index);
//AppsManagerRouter.get('/new/:name', manager.createNewApp);
AuthRouter.get('/', auth.index);
//AuthRouter.get('/:app/*', manager.runApp);

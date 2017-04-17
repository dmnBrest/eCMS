import { Router, Request, Response, NextFunction } from 'express';
import * as path from 'path';
import * as fs from 'fs';
import * as db from './../db';
import * as passport from 'passport'

import { ILoginForm } from './../../common/interfaces'

class Auth {

	public index(req: Request, res: Response, next?: NextFunction) {

		// db.any('select * from public.user where username=$1', ['doom1'])
		// .then(data => {
		// 	console.log(data);
		// })
		// .catch(error => {
		// 	console.log(error);
		// });

		if (req.user && req.user.id) {
			res.redirect('/');
			return;
		}

		res.render('auth.index.html', {});
	}

	public login(req: Request, res: Response, next?: NextFunction) {

		res.setHeader('Content-Type', 'application/json');

		let form = req.body as ILoginForm

		console.log(req.body);

		let user = {
			id: 1,
			username: 'Doom',
			password: '*****',
			email: 'doom@doom.com'
		}

		// req.login(user, function(err){
		// 	if(err) return next(err);
		// 	console.log('Success login', req.user);
		// 	req.session.user = req.user;
		// 	res.json({ status: 'ok', currentUser: user });
		// });

		res.json({ status: 'error', errors: ['Error #1', 'Error #2'] });

	}

	public logout(req: Request, res: Response, next?: NextFunction) {
		req.session.destroy(err => {
			if (err) {
				console.log(err);
			}
			res.redirect('/');
		});
	}

}

const auth = new Auth();

export const AuthRouter = Router();
AuthRouter.get('/', auth.index);
AuthRouter.post('/login', auth.login);
AuthRouter.get('/logout', auth.logout);

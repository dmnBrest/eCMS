import { Router, Request, Response, NextFunction } from 'express';
import * as path from 'path';
import * as fs from 'fs';
import { IQueryResultError } from 'pg-promise';
import * as db from './../services/db.service';
import * as UserService from './../services/user.service';
import * as passport from 'passport'
import * as bcrypt from 'bcrypt';

import { ILoginForm, IRegisterForm, IUser } from './../../common/interfaces'

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

		console.log(form);

		UserService.getUserByEmail(form.email).then((user:IUser) => {
			if (user.is_confirmed == false) {
				res.status(400).json({ status: 'error', errors: ['Please confirm email.'] });
				return;
			}
			if (user.is_blocked == true) {
				res.status(400).json({ status: 'error', errors: ['You are blocked, please contact administrator.'] });
				return;
			}
			if (bcrypt.compareSync(form.password, user.password)) {
				req.login(user, function(err){
					if(err) return next(err);
					req.session.user = req.user;

					if (form.rememberme === true) {
						req.session.cookie.maxAge = 3600000 * 24 * 7; // 1 week
					}

					res.json({ status: 'ok', currentUser: user });
				});
			} else {
				res.status(400).json({ status: 'error', errors: ['Wrong credentials'] });
			}
		}).catch((err) => {
			console.log(err);
			if (err.constructor.name =='QueryResultError') {
				res.status(400).json({ status: 'error', errors: ['Wrong credentials'] });
				return;
			}
			res.status(500).json({});
		});

	}

	public register(req: Request, res: Response, next?: NextFunction) {

		res.setHeader('Content-Type', 'application/json');

		let form = req.body as IRegisterForm
		console.log(form);

		let hash = bcrypt.hashSync(form.password, 10);

		let user:IUser = {
			id: null,
			username: form.username,
			email: form.email,
			password: hash,
			slug: form.username,
			created_at: Math.floor(Date.now() / 1000),
			is_confirmed: false,
			is_admin: false,
			is_blocked: false
		};

		UserService.saveUser(user).then((user:IUser) => {

			res.json({ status: 'ok', currentUser: user });

		}).catch((err) => {
			console.log(err);
			res.status(500).json({});
		});



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
AuthRouter.post('/register', auth.register);
AuthRouter.get('/logout', auth.logout);

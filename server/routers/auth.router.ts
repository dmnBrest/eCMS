import { Router, Request, Response, NextFunction } from 'express';
import * as path from 'path';
import * as fs from 'fs';
import * as bcrypt from 'bcrypt';
import { IQueryResultError } from 'pg-promise';
import * as db from './../services/db.service';
import * as UserService from './../services/user.service';
import * as passport from 'passport'
import * as EmailService from './../services/mail.service';

import { ILoginForm, IRegisterForm, IUser } from './../../common/interfaces'

class Auth {

	public index(req: Request, resp: Response, next?: NextFunction) {

		// db.any('select * from public.user where username=$1', ['doom1'])
		// .then(data => {
		// 	console.log(data);
		// })
		// .catch(error => {
		// 	console.log(error);
		// });

		if (req.user && req.user.id) {
			req.flash('info', 'You have already logged in');
			resp.redirect('/');
			return;
		}

		resp.render('auth.index.nunjucks', {});
	}

	public login(req: Request, resp: Response, next?: NextFunction) {

		resp.setHeader('Content-Type', 'application/json');

		let form = req.body as ILoginForm

		console.log(form);

		// TODO Verify inputs

		UserService.getUserByEmail(form.email).then((user:IUser) => {
			if (user.verification_code) {
				resp.status(400).json({ status: 'error', errors: ['Please confirm email.'] });
				return;
			}
			if (user.is_blocked == true) {
				resp.status(400).json({ status: 'error', errors: ['You are blocked, please contact administrator.'] });
				return;
			}
			if (bcrypt.compareSync(form.password, user.password)) {
				req.login(user, function(err){
					if(err) return next(err);
					req.session.user = req.user;

					if (form.rememberme === true) {
						req.session.cookie.maxAge = 3600000 * 24 * 7; // 1 week
					}

					req.flash('info', 'You have successfully logged in!');

					resp.json({ status: 'ok', currentUser: user });
				});
			} else {
				resp.status(400).json({ status: 'error', errors: ['Wrong credentials'] });
			}
		}).catch((err) => {
			console.log(err);
			if (err.constructor.name =='QueryResultError') {
				resp.status(400).json({ status: 'error', errors: ['Wrong credentials'] });
				return;
			}
			resp.status(500).json({});
		});

	}

	public register(req: Request, resp: Response, next?: NextFunction) {

		resp.setHeader('Content-Type', 'application/json');

		let form = req.body as IRegisterForm
		console.log(form);

		// TODO Verify inputs

		UserService.createUser(form.username, form.email, form.password, false).then((user) => {

			// Send Email Notification for new user
			EmailService.sendNewUserEmail(user).then(
				(info) => {console.log(info);}
			).catch(
				(err) => {console.log(err);}
			);

			resp.json({ status: 'ok', currentUser: user });

		}).catch((err) => {
			console.log(err);
			resp.status(500).json({});
		});

	}

	public logout(req: Request, resp: Response, next?: NextFunction) {
		req.session.destroy(err => {
			if (err) {
				console.log(err);
			}
			resp.redirect('/');
		});
	}

	public verifyEmail(req: Request, resp: Response, next?: NextFunction) {

		console.log(req.params);

		// TODO Verify inputs

		UserService.verifyEmail(req.params['email'], req.params['code'])
		.then((res) => {
			console.log('email verified successfully');
			resp.redirect('/auth');
		})
		.catch((err) => {
			console.log(err);
			resp.status(400).send('Bad request');
		});

	}

}

const auth = new Auth();

export const AuthRouter = Router();
AuthRouter.get('/', auth.index);
AuthRouter.post('/login', auth.login);
AuthRouter.post('/register', auth.register);
AuthRouter.get('/logout', auth.logout);
AuthRouter.get('/verify/:email/:code', auth.verifyEmail);

import { Router, Request, Response, NextFunction } from 'express';
import * as path from 'path';
import * as fs from 'fs';
import * as bcrypt from 'bcrypt';
import { IQueryResultError } from 'pg-promise';
import * as db from './../services/db.service';
import * as UserService from './../services/user.service';
import * as passport from 'passport'
import * as EmailService from './../services/mail.service';
import * as RecaptchaService from './../services/recaptcha.service';

import { ILoginForm, IRegisterForm, IResetForm, INewPasswordForm, IResults, ResultStatus, IUser , INTERNAL_ERROR} from './../interfaces'

class Auth {

	public index(req: Request, resp: Response, next?: NextFunction) {

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

		if (
			!form.email ||
			form.email.length > 255 ||
			!form.password ||
			form.password.length > 1024
		) {
			resp.status(400).send({ status: 'error', errors: ['Bad Request'] });
			return;
		}

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

					resp.json({ status: ResultStatus.SUCCESS } as IResults);
				});
			} else {
				resp.status(400).json({ status: ResultStatus.ERROR, errors: ['Wrong credentials'] } as IResults);
			}
		}).catch((err) => {
			if (err.constructor.name =='QueryResultError') {
				resp.status(400).json({ status: ResultStatus.ERROR, errors: ['Wrong credentials'] } as IResults);
				return;
			}
			resp.status(500).json({});
		});

	}

	public register(req: Request, resp: Response, next?: NextFunction) {

		resp.setHeader('Content-Type', 'application/json');

		let form = req.body as IRegisterForm

		if (
			!form.email ||
			form.email.length > 255 ||
			!form.username ||
			form.username.length > 255 ||
			!form.password ||
			form.password.length > 1024 ||
			!form.token
		) {
			resp.status(400).send({ status: ResultStatus.ERROR, errors: ['Bad Request'] } as IResults);
			return;
		}

		// TODO Check for duplicates by Email and Username

		// Check reCaptcha
		RecaptchaService.validateCaptcha(form.token)
		.then((res:any) => {
			// Create new user
			UserService.createUser(form.username, form.email, form.password, false).then((user:IUser) => {

				// Send Email Notification for new user
				EmailService.sendNewUserEmail(user).then(
					(info) => {console.log(info);}
				).catch(
					(err) => {console.log(err);}
				);

				req.flash('info', 'You have successfully registered! Please confirm your email.');

				resp.json({ status: ResultStatus.SUCCESS } as IResults);

			}).catch((err) => {
				console.log(err);
				resp.status(400).json({ status: ResultStatus.ERROR, errors: ['Bad Request'] } as IResults);
			});
		}).catch((err) => {
			resp.status(400).json({ status: ResultStatus.ERROR, errors: ['Bad Captcha'] } as IResults);
		});




	}

	public changePassword(req: Request, resp: Response, next?: NextFunction) {

		resp.setHeader('Content-Type', 'application/json');

		let form = req.body as INewPasswordForm;

		if (
			!form.email ||
			form.email.length > 255 ||
			!form.token ||
			form.token.length > 36 ||
			!form.password ||
			form.password.length > 1024
		) {
			resp.status(400).send({ status: ResultStatus.ERROR, errors: ['Bad Request'] } as IResults);
			return;
		}

		UserService.changePassword(form.email, form.password, form.token).then((user:IUser) => {

			// TODO Password was changed notification

			// Send Email Notification for new user
			// EmailService.sendNewUserEmail(user).then(
			// 	(info) => {console.log(info);}
			// ).catch(
			// 	(err) => {console.log(err);}
			// );

			req.flash('info', 'Password was changed. You can login with new password.');
			resp.json({ status: ResultStatus.SUCCESS } as IResults);

		}).catch((err) => {
			console.log(err);
			resp.status(400).json({ status: ResultStatus.ERROR, errors: [err] } as IResults);
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

	public sendResetToken(req: Request, resp: Response, next?: NextFunction) {

		resp.setHeader('Content-Type', 'application/json');

		let form = req.body as IResetForm

		if (
			!form.email ||
			form.email.length > 255
		) {
			resp.status(400).send({ status: ResultStatus.ERROR, errors: ['Bad Request'] } as IResults);
			return;
		}

		UserService.resetPassword(form.email)
		.then((token) => {
			console.log('email "'+form.email+'" reset password token: ', token);

			// Send Email Notification for new user
			EmailService.sendResetPasswordEmail(form.email, token).then(
				(info) => {console.log(info);}
			).catch(
				(err) => {console.log(err);}
			);

			req.flash('info', 'Please check your email account for reset password link');
			resp.json({ status: ResultStatus.SUCCESS } as IResults);
		})
		.catch((err) => {
			console.log(err)
			if (err.constructor.name =='QueryResultError') {
				resp.status(400).json({ status: ResultStatus.ERROR, errors: ['Email not found.'] } as IResults);
				return;
			}
			resp.status(500).json({status: ResultStatus.ERROR, errors: [INTERNAL_ERROR]} as IResults);
		});
	}


	public verifyEmail(req: Request, resp: Response, next?: NextFunction) {

		if (
			!req.params['email'] ||
			req.params['email'].length > 255 ||
			!req.params['code'] ||
			req.params['code'].length > 36
		) {
			resp.status(400).send('Bad request');
			return;
		}

		UserService.verifyEmail(req.params['email'], req.params['code'])
		.then((res) => {
			console.log('email "'+req.params['email']+'" verified successfully');
			req.flash('info', 'Your email verified. You can login now.');
			resp.redirect('/auth#/login');
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
AuthRouter.get('/logout', auth.logout);
AuthRouter.get('/verify/:email/:code', auth.verifyEmail);
AuthRouter.post('/login', auth.login);
AuthRouter.post('/register', auth.register);
AuthRouter.post('/reset', auth.sendResetToken);
AuthRouter.post('/change-password', auth.changePassword);


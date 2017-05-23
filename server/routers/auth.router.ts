import { Router, Request, Response, NextFunction } from 'express';
import * as path from 'path';
import * as fs from 'fs';
import * as bcrypt from 'bcrypt';
import { IQueryResultError } from 'pg-promise';
import { db }  from './../services/db.service';
import * as passport from 'passport'
import * as UserService from './../services/user.service';
import * as EmailService from './../services/mail.service';
import * as RecaptchaService from './../services/recaptcha.service';
import * as I from './../interfaces';

class Auth {

	// INDEX
	public index(req: Request, resp: Response, next?: NextFunction) {

		// If user is logged in redirect to Home page with message
		if (req.user && req.user.id) {
			req.flash('info', 'You are already logged in');
			resp.redirect('/');
		} else {
			resp.render('auth.index.nunjucks', {});
		}
	}

	// LOGIN
	public async login(req: Request, resp: Response, next?: NextFunction) {

		resp.setHeader('Content-Type', 'application/json');

		let form = req.body as I.ILoginForm

		// Validate form
		if (
			!form.email ||
			form.email.length > 255 ||
			!form.password ||
			form.password.length > 1024
		) {
			resp.status(400).send({ status: 'error', errors: ['Bad Request'] });
			return;
		}

		// Get User by email
		try {
			let user:I.UserInstance = await UserService.getUserByEmail(form.email)
			if (user == null) {
				resp.status(400).json({ status: I.ResultStatus.ERROR, errors: ['Wrong credentials'] } as I.IResults);
				return;
			}

			// Check if user confirm email
			if (user.verification_code) {
				resp.status(400).json({ status: 'error', errors: ['Please confirm email.'] });
				return;
			}
			// Check is user is not blocked
			if (user.is_blocked == true) {
				resp.status(400).json({ status: 'error', errors: ['You are blocked, please contact administrator.'] });
				return;
			}
			// Compare password
			if (!bcrypt.compareSync(form.password, user.password)) {
				resp.status(400).json({ status: I.ResultStatus.ERROR, errors: ['Wrong credentials'] } as I.IResults);
				return;
			}

			req.login(user, function(err){
				if(err) return next(err);
				req.session.user = req.user;
				if (form.rememberme === true) {
					req.session.cookie.maxAge = 3600000 * 24 * 7; // 1 week
				}
				UserService.setLoginAt(user);
				req.flash('info', 'You have successfully logged in!');
				resp.json({ status: I.ResultStatus.SUCCESS } as I.IResults);
			});

		} catch(err) {
			resp.status(500).json({ status: I.ResultStatus.ERROR, errors: [I.INTERNAL_ERROR] } as I.IResults);
			return;
		}
	}

	// REGISTERATION
	public async register(req: Request, resp: Response, next?: NextFunction) {

		resp.setHeader('Content-Type', 'application/json');

		let form = req.body as I.IRegisterForm

		// Validate form
		if (
			!form.email ||
			form.email.length > 255 ||
			!form.username ||
			form.username.length > 255 ||
			!form.password ||
			form.password.length > 1024 ||
			!form.token
		) {
			resp.status(400).send({ status: I.ResultStatus.ERROR, errors: ['Bad Request'] } as I.IResults);
			return;
		}

		// Check for duplicates by Email and Username
		try {
			let n = await UserService.getTotalByEmailOrUsername(form.email, form.username, null);
			if (n > 0) {
				resp.status(400).json({ status: I.ResultStatus.ERROR, errors: ['Email or username already in use.'] } as I.IResults);
				return;
			}
		} catch(err) {
			resp.status(500).json({ status: I.ResultStatus.ERROR, errors: [I.INTERNAL_ERROR] } as I.IResults);
			return;
		}

		// Check reCaptcha
		try {
			await RecaptchaService.validateCaptcha(form.token);
		} catch(err) {
			resp.status(400).json({ status: I.ResultStatus.ERROR, errors: ['Bad Captcha'] } as I.IResults);
			return;
		}

		// Create new user
		let user:I.IUser;
		try {
			user = await UserService.createUser(form.username, form.email, form.password, false);
		} catch(err) {
			resp.status(500).json({ status: I.ResultStatus.ERROR, errors: [I.INTERNAL_ERROR] } as I.IResults);
			return;
		}

		// Send Email Notification for new user
		EmailService.sendNewUserEmail(user.id).then(
			(info) => {console.log(info);}
		).catch(
			(err) => {console.log(err);}
		);

		req.flash('info', 'You have successfully registered! Please confirm your email.');
		resp.json({ status: I.ResultStatus.SUCCESS } as I.IResults);

	}

	// CHANGE PASSWORD WITH TOKEN
	public async changePassword(req: Request, resp: Response, next?: NextFunction) {

		resp.setHeader('Content-Type', 'application/json');

		let form = req.body as I.INewPasswordForm;

		// Validate form
		if (
			!form.email ||
			form.email.length > 255 ||
			!form.token ||
			form.token.length > 36 ||
			!form.password ||
			form.password.length > 1024
		) {
			resp.status(400).send({ status: I.ResultStatus.ERROR, errors: ['Bad Request'] } as I.IResults);
			return;
		}

		// Change password for user wit email and reset password token
		try {
			let userId = await UserService.changePasswordWithToken(form.email, form.password, form.token);

			// TODO Password was changed notification
			// Send Email Notification for new user
			// EmailService.sendNewUserEmail(user).then(
			// 	(info) => {console.log(info);}
			// ).catch(
			// 	(err) => {console.log(err);}
			// );

			req.flash('info', 'Password was changed. You can login with new password.');
			resp.json({ status: I.ResultStatus.SUCCESS } as I.IResults);

		} catch(err) {
			console.log(err);
			resp.status(400).json({ status: I.ResultStatus.ERROR, errors: [err] } as I.IResults);
		};

	}

	// LOGOUT
	public logout(req: Request, resp: Response, next?: NextFunction) {
		req.session.destroy(err => {
			if (err) {
				console.log(err);
			}
			resp.redirect('/');
		});
	}

	// SEND RESET PASSWORD TOKEN
	public async sendResetToken(req: Request, resp: Response, next?: NextFunction) {

		resp.setHeader('Content-Type', 'application/json');

		let form = req.body as I.IResetForm

		if (
			!form.email ||
			form.email.length > 255
		) {
			resp.status(400).send({ status: I.ResultStatus.ERROR, errors: ['Bad Request'] } as I.IResults);
			return;
		}

		let user:I.UserInstance;
		try {
			user = await UserService.resetPassword(form.email)
		} catch(err) {
			console.log(err)
			resp.status(400).json({status: I.ResultStatus.ERROR, errors: [err]} as I.IResults);
			return;
		};
		console.log('email "'+form.email+'" reset password token: ', user.reset_password_token);

		req.flash('info', 'Please check your email account for reset password link');
		resp.json({ status: I.ResultStatus.SUCCESS } as I.IResults);

		// Send Email Notification for new user
		EmailService.sendResetPasswordEmail(form.email, user.reset_password_token).then(
			(info) => {console.log(info);}
		).catch(
			(err) => {console.log(err);}
		);

	}

	// VERIFY EMAIL
	public async verifyEmail(req: Request, resp: Response, next?: NextFunction) {

		if (
			!req.params['email'] ||
			req.params['email'].length > 255 ||
			!req.params['code'] ||
			req.params['code'].length > 36
		) {
			resp.status(400).send('Bad request');
			return;
		}

		try {
			let uset:I.UserInstance = await UserService.verifyEmail(req.params['email'], req.params['code']);
			console.log('email "'+req.params['email']+'" verified successfully');
			req.flash('info', 'Your email verified. You can login now.');
			resp.redirect('/auth#/login');
		} catch(err) {
			console.log(err);
			resp.status(400).send('Bad request');
		};
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


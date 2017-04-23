import { Router, Request, Response, NextFunction } from 'express';
import * as path from 'path';
import * as fs from 'fs';
import * as passport from 'passport'

import * as EmailService from './../services/mail.service'

class Home {

	public index(req: Request, res: Response, next?: NextFunction) {
		// res.cookie( 'ddddd', 'vvvvv', { maxAge: 1000 * 60 * 10, httpOnly: false });
		// req.session['key-name'] = 'Hello, world!';

		EmailService.sendNewUserEmail().then(res => {
			console.log('email:');
			console.log(res);

		});

		console.log( 'ddddd: ', req.cookies['ddddd'])
		console.log('key-name: ', req.session['key-name']);

		console.log('Counter: ' + req.session.counter);
		if (!req.session.counter) {
			req.session.counter = 10;
		} else {
			req.session.counter++;
		}

		console.log('Counter: ' + req.session.counter);

		res.render('home.index.html', {});
	}

}

const home = new Home();

export const HomeRouter = Router();
HomeRouter.get('/', home.index);
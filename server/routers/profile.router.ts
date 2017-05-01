import { Router, Request, Response, NextFunction } from 'express';
import * as path from 'path';
import * as fs from 'fs';
import * as passport from 'passport';
import { isLoggedIn } from './../services/security.service';

import * as UserService from './../services/user.service';

import { ISettingsForm, IResults, ResultStatus, IUser , INTERNAL_ERROR} from './../interfaces'

class Profile {

	public index(req: Request, resp: Response, next?: NextFunction) {
		resp.render('profile.index.nunjucks', {});
	}

	public saveSettings(req: Request, resp: Response, next?: NextFunction) {

		resp.setHeader('Content-Type', 'application/json');

		let form = req.body as ISettingsForm

		// Validate form
		if (
			!form.email ||
			form.email.length > 255 ||
			!form.username ||
			form.username.length > 255

			// TODO add other fields to validation

		) {
			resp.status(400).send({ status: ResultStatus.ERROR, errors: ['Bad Request'] } as IResults);
			return;
		}

		UserService.getUserById(req.user.id)
		.then((user) => {

			user.username = 'XXXXX';

			resp.json({ status: ResultStatus.SUCCESS, payload: user } as IResults);
		})
		.catch((err) => {
			resp.status(500).json({ status: ResultStatus.ERROR, errors: [INTERNAL_ERROR] } as IResults);
		});

	}


}

const profile = new Profile();

export const ProfileRouter = Router();
ProfileRouter.get('/', isLoggedIn, profile.index);
ProfileRouter.post('/save-settings', isLoggedIn, profile.saveSettings);
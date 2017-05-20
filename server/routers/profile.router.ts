import { Router, Request, Response, NextFunction } from 'express';
import * as path from 'path';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as passport from 'passport';
import { isLoggedIn } from './../services/security.service';

import * as UserService from './../services/user.service';

import * as I from './../interfaces'

class Profile {

	// INDEX
	public index(req: Request, resp: Response, next?: NextFunction) {
		resp.render('profile.index.nunjucks', {});
	}


	// SAVE SETTINGS
	public async saveSettings(req: Request, resp: Response, next?: NextFunction) {

		resp.setHeader('Content-Type', 'application/json');

		let form = req.body as I.ISettingsForm;
		console.log(form)

		// Validate form
		if (
			!form.email ||
			form.email.length > 255 ||
			!form.username ||
			form.username.length > 255 ||
			(form.changePassword && (
				!form.password ||
				form.password.length > 255 ||
				form.confirmPassword != form.password
			))
		) {
			resp.status(400).send({ status: I.ResultStatus.ERROR, errors: ['Bad Request'] } as I.IResults);
			return;
		}

		let user;
		try {
			user = await UserService.getUserById(req.user.id);
		} catch(err) {
			resp.status(500).json({ status: I.ResultStatus.ERROR, errors: [I.INTERNAL_ERROR] } as I.IResults);
			return;
		}

		// check old password
		if (form.changePassword && !bcrypt.compareSync(form.oldPassword, user.password)) {
			resp.status(400).send({ status: I.ResultStatus.ERROR, errors: ['Old password is wrong'] } as I.IResults);
			return;
		}

		// Only Username can be changed. Email change is restricted (TODO make it updatable)
		if (user.username != form.username) {
			try {
				let n = await UserService.getTotalByEmailOrUsername(form.email, form.username, user.id);
				if (n > 0) {
					resp.status(400).json({ status: I.ResultStatus.ERROR, errors: ['Username already in use'] } as I.IResults);
					return;
				}
			} catch(err) {
				console.log(err);
				resp.status(500).json({ status: I.ResultStatus.ERROR, errors: [I.INTERNAL_ERROR] } as I.IResults);
					return;
			};
			try {
				let userId = await UserService.updateUsername(user.id, form.username);
			} catch(err) {
				console.log(err);
				resp.status(500).json({ status: I.ResultStatus.ERROR, errors: [I.INTERNAL_ERROR] } as I.IResults);
				return;
			}
		}

		if (form.changePassword) {
			try {
				let userId = await UserService.updatePassword(user.id, form.password);
			} catch(err) {
				console.log(err);
				resp.status(500).json({ status: I.ResultStatus.ERROR, errors: [I.INTERNAL_ERROR] } as I.IResults);
				return;
			}
		}

		try {
			user = await UserService.getUserById(req.user.id);
		} catch(err) {
			resp.status(500).json({ status: I.ResultStatus.ERROR, errors: [I.INTERNAL_ERROR] } as I.IResults);
			return;
		}

		resp.json({ status: I.ResultStatus.SUCCESS, payload: user } as I.IResults);

	}


}

const profile = new Profile();

export const ProfileRouter = Router();
ProfileRouter.get('/', isLoggedIn, profile.index);
ProfileRouter.post('/save-settings', isLoggedIn, profile.saveSettings);
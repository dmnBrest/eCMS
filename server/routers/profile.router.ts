import { Router, Request, Response, NextFunction } from 'express';
import * as path from 'path';
import * as fs from 'fs';
import * as passport from 'passport';
import { isLoggedIn } from './../services/security.service';

class Profile {

	public index(req: Request, res: Response, next?: NextFunction) {


		res.render('profile.index.nunjucks', {});
	}

}

const profile = new Profile();

export const ProfileRouter = Router();
ProfileRouter.get('/', isLoggedIn, profile.index);
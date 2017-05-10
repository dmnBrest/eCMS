import { Router, Request, Response, NextFunction } from 'express';
import * as path from 'path';
import * as fs from 'fs';

import { isAdmin } from './../services/security.service';

class Admin {

	public index(req: Request, res: Response, next?: NextFunction) {

		res.render('admin.index.nunjucks', {});
	}

}

const admin = new Admin();

export const AdminRouter = Router();
AdminRouter.get('/', isAdmin, admin.index);
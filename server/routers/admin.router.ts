import { Router, Request, Response, NextFunction } from 'express';
import * as path from 'path';
import * as fs from 'fs';
import * as UserService from './../services/user.service';
import { isAdmin } from './../services/security.service';
import { IResults, ResultStatus, IUser, INTERNAL_ERROR} from './../interfaces'

class Admin {

	public index(req: Request, resp: Response, next?: NextFunction) {
		resp.render('admin.index.nunjucks', {});
	}

	public async getUsers(req: Request, resp: Response, next?: NextFunction) {
		resp.setHeader('Content-Type', 'application/json');

		let input = req.body
		console.log(input);

		let users;
		try {
			users = await UserService.getUsers(input.page, input.usersPerPage);
		} catch(err) {
			resp.status(500).json({ status: ResultStatus.ERROR, errors: [INTERNAL_ERROR] } as IResults);
			return;
		}

		let totalUsers;
		try {
			totalUsers = await UserService.getTotalUsers();
			console.log(totalUsers);
		} catch(err) {
			resp.status(500).json({ status: ResultStatus.ERROR, errors: [INTERNAL_ERROR] } as IResults);
			return;
		}

		let payload = {
			users: users,
			totalUsers: totalUsers
		}

		resp.json({ status: ResultStatus.SUCCESS, payload: payload } as IResults);
	}

}

const admin = new Admin();

export const AdminRouter = Router();
AdminRouter.get('/', isAdmin, admin.index);
AdminRouter.post('/get-users', isAdmin, admin.getUsers);
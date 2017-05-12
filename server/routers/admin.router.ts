import { Router, Request, Response, NextFunction } from 'express';
import * as path from 'path';
import * as fs from 'fs';
import * as UserService from './../services/user.service';
import { isAdmin } from './../services/security.service';
import * as I from './../interfaces';

class Admin {

	public index(req: Request, resp: Response, next?: NextFunction) {
		resp.render('admin.index.nunjucks', {});
	}

	public async getObjects(req: Request, resp: Response, next?: NextFunction) {
		resp.setHeader('Content-Type', 'application/json');

		let state = req.body as I.IListViewState
		console.log(state);

		let objects:any[];
		try {
			if (state.object == 'users') {
				objects = await UserService.getUsers(state.page, state.perPage);
			} else {
				objects = [];
			}
		} catch(err) {
			resp.status(500).json({ status: I.ResultStatus.ERROR, errors: [I.INTERNAL_ERROR] } as I.IResults);
			return;
		}
		state.list = objects;

		let totalUsers;
		try {
			totalUsers = await UserService.getTotalUsers();
			console.log(totalUsers);
		} catch(err) {
			resp.status(500).json({ status: I.ResultStatus.ERROR, errors: [I.INTERNAL_ERROR] } as I.IResults);
			return;
		}

		state.totalPages = Math.ceil(totalUsers / state.perPage);

		console.log(state);

		resp.json({ status: I.ResultStatus.SUCCESS, payload: state } as I.IResults);
	}

}

const admin = new Admin();

export const AdminRouter = Router();
AdminRouter.get('/', isAdmin, admin.index);
AdminRouter.post('/get-objects', isAdmin, admin.getObjects);
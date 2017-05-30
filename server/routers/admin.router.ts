import { Router, Request, Response, NextFunction } from 'express';
import * as path from 'path';
import * as fs from 'fs';
import * as UserService from './../services/user.service';
import * as ObjectService from './../services/object.service';
import * as TopicService from './../services/topic.service';
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
			if (state.object == 'user') {
				objects = await UserService.getUsers(state.page, state.perPage);
			} else if (state.object == 'topic') {
				objects = await TopicService.getTopics(state.page, state.perPage, true);
			} else {
				throw 'Object not found';
			}
		} catch(err) {
			console.log(err);
			resp.status(500).json({ status: I.ResultStatus.ERROR, errors: [I.INTERNAL_ERROR] } as I.IResults);
			return;
		}
		state.list = objects;

		let total:number;
		try {
			total = await ObjectService.getTotalObjects(state.object);
		} catch(err) {
			console.log(err);
			resp.status(500).json({ status: I.ResultStatus.ERROR, errors: [I.INTERNAL_ERROR] } as I.IResults);
			return;
		}
		state.totalPages = Math.ceil(total / state.perPage);
		resp.json({ status: I.ResultStatus.SUCCESS, payload: state } as I.IResults);
	}

	public async getObjectById(req: Request, resp: Response, next?: NextFunction) {
		resp.setHeader('Content-Type', 'application/json');

		let input = req.body
		console.log(input);

		let object:any;
		try {
			object = await ObjectService.getObjectById(input.objType, input.id);
		} catch(err) {
			console.log(err);
			resp.status(500).json({ status: I.ResultStatus.ERROR, errors: [I.INTERNAL_ERROR] } as I.IResults);
			return;
		}

		resp.json({ status: I.ResultStatus.SUCCESS, payload: object } as I.IResults);
	}

	public async saveTopic(req: Request, resp: Response, next?: NextFunction) {
		resp.setHeader('Content-Type', 'application/json');

		let topicObj = req.body as I.ITopic
		console.log(topicObj);

		let topic:I.TopicInstance;
		try {
			 topic = await TopicService.saveTopic(topicObj);
		} catch(err) {
			console.log(err);
			resp.status(500).json({ status: I.ResultStatus.ERROR, errors: [I.INTERNAL_ERROR] } as I.IResults);
			return;
		}
		try {
			 topic = await ObjectService.getObjectById('topic', topic.id);
		} catch(err) {
			console.log(err);
			resp.status(500).json({ status: I.ResultStatus.ERROR, errors: [I.INTERNAL_ERROR] } as I.IResults);
			return;
		}

		resp.json({ status: I.ResultStatus.SUCCESS, payload: topic } as I.IResults);
	}
}


const admin = new Admin();
export const AdminRouter = Router();
AdminRouter.get('/', isAdmin, admin.index);
AdminRouter.post('/get-objects', isAdmin, admin.getObjects);
AdminRouter.post('/get-object-by-id', isAdmin, admin.getObjectById);
AdminRouter.post('/save-topic', isAdmin, admin.saveTopic);
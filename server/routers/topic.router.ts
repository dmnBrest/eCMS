import { Router, Request, Response, NextFunction } from 'express';
import * as TopicService from './../services/topic.service';
import * as I from './../interfaces';

class Topic {

	public async index(req: Request, resp: Response, next?: NextFunction) {

		try {
			let topics = await TopicService.getTopics(1, 100, false);
			resp.locals.breadcrumbs.push({label: 'Topics', url: '/topics'});
			resp.render('topic.list.nunjucks', {topics: topics});
		} catch(err) {
			console.log(err);
			resp.status(500).send(I.INTERNAL_ERROR)
		}

	}

}

const topic = new Topic();

export const TopicRouter = Router();
TopicRouter.get('/', topic.index);
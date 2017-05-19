import { Router, Request, Response, NextFunction } from 'express';
import * as path from 'path';
import * as fs from 'fs';
import * as passport from 'passport';
import * as TopicService from './../services/topic.service';

import * as EmailService from './../services/mail.service'

class Home {

	public index(req: Request, res: Response, next?: NextFunction) {

		res.render('home.index.nunjucks', {});
	}

	public async topic(req: Request, res: Response, next?: NextFunction) {

		let topicSlug = req.params.slug
		console.log('topicSlug: ', topicSlug);

		try {
			let topic = await TopicService.getTopicBySlug(topicSlug);
			res.locals.breadcrumbs.push({label: 'Topics', url: '/topics'});
			res.locals.breadcrumbs.push({label: topic.title, url: '/topic-'+topic.slug});
			res.render('topic.view.nunjucks', {topic: topic, posts: []});
		} catch (err) {
			console.log(err);
			res.status(404).send('404: Page not Found');
		}
	}

}

const home = new Home();

export const HomeRouter = Router();
HomeRouter.get('/', home.index);
HomeRouter.get('/topic-:slug', home.topic);

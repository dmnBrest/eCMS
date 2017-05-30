import { Router, Request, Response, NextFunction } from 'express';
import * as path from 'path';
import * as fs from 'fs';
import * as passport from 'passport';
import * as TopicService from './../services/topic.service';
import * as PostService from './../services/post.service';

import * as I from './../interfaces'

import * as EmailService from './../services/mail.service'

class Home {

	public index(req: Request, res: Response, next?: NextFunction) {

		res.render('home.index.nunjucks', {});
	}

	public async topic(req: Request, res: Response, next?: NextFunction) {

		let topicSlug = req.params.slug
		console.log('topicSlug: ', topicSlug);

		let topic: I.TopicInstance;
		let posts: I.PostInstance[];
		try {
			topic = await TopicService.getTopicBySlug(topicSlug);
			if (topic == null) {
				res.status(404).send('404: Page not Found');
				return;
			}
			posts = await PostService.getPostsByTopicId(topic.id)
		} catch (err) {
			console.log(err);
			res.status(500).send(I.INTERNAL_ERROR);
			return;
		}

		(res.locals.initialState as I.IAppState).selectedTopic = topic;
		res.locals.breadcrumbs.push({label: 'Topics', url: '/topics'});
		res.locals.breadcrumbs.push({label: topic.title, url: '/topic-'+topic.slug});
		res.render('topic.view.nunjucks', {topic: topic, posts: posts});

	}

	public async post(req: Request, res: Response, next?: NextFunction) {

		let postSlug = req.params.slug
		console.log('postSlug: ', postSlug);

		let post: I.PostInstance;
		let comments: I.PostInstance[];
		try {
			post = await PostService.getPostBySlug(postSlug);
			if (post == null) {
				res.status(404).send('404: Page not Found');
				return;
			}
			comments = await PostService.getRelatedPosts(post.id);
		} catch (err) {
			console.log(err);
			res.status(500).send(I.INTERNAL_ERROR);
			return;
		}

		(res.locals.initialState as I.IAppState).selectedPost = post;
		(res.locals.initialState as I.IAppState).selectedTopic = post.Topic;

		res.locals.breadcrumbs.push({label: 'Topics', url: '/topics'});
		res.locals.breadcrumbs.push({label: post.Topic.title, url: '/topic-'+post.Topic.slug});
		res.locals.breadcrumbs.push({label: post.title, url: '/post-'+post.slug});
		res.render('post.view.nunjucks', {post: post, comments: comments});

	}

}

const home = new Home();

export const HomeRouter = Router();
HomeRouter.get('/', home.index);
HomeRouter.get('/topic-:slug', home.topic);
HomeRouter.get('/post-:slug', home.post);

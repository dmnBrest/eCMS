import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as expressSession from 'express-session';
import * as path from 'path';
import * as fs from 'fs';
import * as nunjucks from 'nunjucks';
import * as morgan from 'morgan';
import * as http from 'http';
import * as passport from 'passport';
import { Strategy as LocalStrategy, VerifyFunction, IVerifyOptions } from 'passport-local'

var fileStore = require('session-file-store')(expressSession);

import { appConfig } from './config';
import { HomeRouter } from './routers/home.router';
import { AuthRouter } from './routers/auth.router';
import { ForumRouter } from './routers/forum.router';
import { ProfileRouter } from './routers/profile.router';

require('source-map-support').install();

export class ExpressServer {

	public app: express.Application;
	public server: http.Server;

	public constructor() {

	}

	public run(): Promise<any> {
		this.app = express();

		this.app.use(cookieParser())
		// this.app.use(expressSession({
		// 	secret: '02j32j9u329hu39hf29hf23h',
		// 	resave: false,
		// 	saveUninitialized: true,
		// 	cookie: { secure: false, maxAge: 20000 },
		// }));
		this.app.use(expressSession({
			store: new fileStore({}),
			secret: 'keyboard cat',
			resave: false,
			saveUninitialized: true,
			cookie: { secure: false, maxAge: 24 * 60 * 60000 }, // 60000 - 1 min
		}));


		this.app.use(bodyParser.urlencoded({ extended: false }));
		this.app.use(bodyParser.json());

		this.app.use(morgan('tiny'));

		passport.use(new LocalStrategy(
			function(username: string, password: string, done: (error: any, user?: any, options?: IVerifyOptions) => void) {

				console.log('AAAA');
				console.log(username);
				console.log(password);


				let user:any = {
					password: null
				};
				if (!user) {
					return done(null, false, { message: 'Incorrect username.' });
				}
				if (!user.password) {
					return done(null, false, { message: 'Incorrect password.' });
				}
				return done(null, user);
			}
		));

		passport.serializeUser(function(user, done) {
			let u = JSON.stringify(user);
			console.log('serializeUser: ', u);
			done(null, u);
		});

		passport.deserializeUser(function(user:string, done) {
			let u = JSON.parse(user);
			console.log('deserializeUser: ', u);
			done(null, u);
		});

		let nuEnv = nunjucks.configure(path.join(__dirname, 'templates'), {
			autoescape: true,
			express: this.app
		});

		this.app.use(passport.initialize());
		this.app.use(passport.session());


		// CUSTOM MIDDLEWARE
		this.app.use((req, res, next) => {
			console.log(`Route: ${req.path}`);

			// Share Current User to Template
			res.locals.user = req.user;

			// initial State for Angular
			res.locals.initialState = JSON.stringify({
				currentUser: req.user
			});

			next();
		});

		this.app.use('/static', express.static(path.join(__dirname, '../static')));
		//this.app.use('/dist', express.static(path.join(__dirname, '../dist/client')));
		this.app.use('/auth', AuthRouter);
		this.app.use('/forum', ForumRouter);
		this.app.use('/profile', ProfileRouter);
		this.app.get('/', HomeRouter);

		// Handle 404
		this.app.use(function(req, res) {
			res.status(404).send('404: Page not Found');
		});

		return new Promise((resolve, reject) => {
			try {

				this.server = http.createServer(this.app);

				this.server.listen(3001, () => {
					console.log('SERVER started on port 3001!');
					resolve();
				}).on('error', (e) => {reject(e)});
			} catch(e) {
				reject(e);
			}
		});
	}
}

let server = new ExpressServer();
server.run();
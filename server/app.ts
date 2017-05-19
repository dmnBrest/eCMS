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
import * as errorhandler from 'errorhandler';
import { v4 as uuidV4} from 'uuid';
import { Strategy as LocalStrategy, VerifyFunction, IVerifyOptions } from 'passport-local'

var RedisStore = require('connect-redis')(expressSession);

var csrf = require('csurf');
var flash = require('connect-flash');

import { appConfig } from './config';
import { HomeRouter } from './routers/home.router';
import { AuthRouter } from './routers/auth.router';
import { TopicRouter } from './routers/topic.router';
import { ProfileRouter } from './routers/profile.router';
import { AdminRouter } from './routers/admin.router';
import { serializeUser, deserializeUser } from './services/security.service'

require('source-map-support').install();

export class ExpressServer {

	public app: express.Application;
	public server: http.Server;

	public constructor() {

	}

	public run(): Promise<any> {
		this.app = express();

		let nEnv = nunjucks.configure(path.join(__dirname, 'templates'), {
			autoescape: true,
			express: this.app
		});

		nEnv.addFilter('json', function(obj) {
			return JSON.stringify(obj);
		});


		this.app.use(bodyParser.urlencoded({ extended: false }));
		this.app.use(bodyParser.json());

		if (process.env.NODE_ENV == 'development') {
			console.log('= DEVELOPMENT MODE =');

			this.app.use(cookieParser())

			this.app.use(csrf({ cookie: true }))

			this.app.use(expressSession({
				secret: 'keyboard cat',
				resave: false,
				saveUninitialized: true,
				cookie: { secure: false, maxAge: null }, // 60000 - 1 min
				genid: function(req) {
					return uuidV4();
				},
				store: new RedisStore({
					host : 'localhost',
					port : '6380' // default is 6379
				}),
			}));

			this.app.use(morgan('tiny'));

			this.app.use('/static', express.static(path.join(__dirname, './static')));
			this.app.use('/slds', express.static(path.join(__dirname, './../node_modules/@salesforce-ux/design-system/assets')));

		} else if (process.env.NODE_ENV == 'production') {
			console.log('= PRODUCTION MODE =');

			console.error('... TODO');

			// this.app.use(cookieParser()) // TODO SECURE

			// let csrfProtection = csrf({ cookie: true });


			// this.app.use(expressSession({ // TODO REDIS STORE
			// 	secret: '02j32j9u329hu39hf29hf23h',
			// 	resave: false,
			// 	saveUninitialized: true,
			// 	cookie: { secure: false, maxAge: 20000 },
			// }));

			// TODO Static files to NGINX
		};

		this.app.use(flash());

		// Passport JS init
		passport.serializeUser(serializeUser);
		passport.deserializeUser(deserializeUser);
		this.app.use(passport.initialize());
		this.app.use(passport.session());

		// CUSTOM MIDDLEWARE
		this.app.use((req, res, next) => {
			// Share Current User for Template
			res.locals.user = req.user;
			// initial State for Angular apps
			res.locals.initialState = {
				errors: [],
				info: [],
				currentUser: req.user
			};

			let m1 = req.flash('error');
			let m2 = req.flash('info');

			res.locals.initialState.errors = res.locals.initialState.errors.concat(m1);
			res.locals.initialState.info = res.locals.initialState.info.concat(m2);
			res.locals.csrfToken = req.csrfToken();
			res.locals.appConfig = appConfig;
			res.locals.breadcrumbs = [{label: 'Home', url: '/'}];

			next();
		});

		this.app.use('/auth', AuthRouter);
		this.app.use('/topics', TopicRouter);
		this.app.use('/profile', ProfileRouter);
		this.app.use('/admin', AdminRouter);
		this.app.use('/', HomeRouter);

		// Handle 404
		this.app.use(function(req, res) {

			// TODO :Wrap 404 page to layout
			res.status(404).send('404: Page not Found');
		});

		// TODO ADD CUSTOM ERROR HANDLER
		if (process.env.NODE_ENV == 'development') {
			this.app.use(errorhandler());
		} else if (process.env.NODE_ENV == 'production') {
			//this.app.use(express.errorHandler());
		}

		// RUN SERVER
		if (process.env.NODE_ENV == 'development') {
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
		} else if (process.env.NODE_ENV == 'production') {
			return null;
		}
		return null;
	}
}

let server = new ExpressServer();
server.run();
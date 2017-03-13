import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as path from 'path';
import * as fs from 'fs';
import * as nunjucks from 'nunjucks';
import * as morgan from 'morgan';
import * as http from 'http';
// import { } from './interfaces';
import { appConfig } from './config';
import { AuthRouter } from './routers/auth.router';
// import { RemoteActionRouter } from './routers/remote-action.router';

export class ExpressServer {

	public app: express.Application;
	public server: http.Server;

	public constructor() {

	}

	public run(): Promise<any> {
		this.app = express();

		this.app.use(morgan('tiny'));

		nunjucks.configure(path.join(__dirname, 'templates'), {
			autoescape: true,
			express: this.app
		});

		this.app.use((req, res, next) => {
			console.log(`Route: ${req.path}`);
			next();
		});

		this.app.use(bodyParser.urlencoded({ extended: false }));
		this.app.use(bodyParser.json());

		this.app.use('/static', express.static(path.join(__dirname, 'static')));
		this.app.use('/dist', express.static(path.join(__dirname, 'dist')));
		this.app.use('/auth', AuthRouter);

		this.app.get('/', (req: express.Request, res: express.Response) => {

			res.render('home/index.html', {});

		});
	
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
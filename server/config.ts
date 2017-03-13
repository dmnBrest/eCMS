
import * as fs from 'fs';
import * as path from 'path';
import { ILocals } from './interfaces';

export class AppConfig {

	private static instance: ILocals;
	private constructor() {}
	public static getInstance(): ILocals {
		if (!AppConfig.instance) {
			this.instance = JSON.parse(fs.readFileSync(path.join(__dirname, './../config.json'), 'utf8'));
			console.log('Config init');
			console.log(this.instance);
		}
		return this.instance;
	}

}
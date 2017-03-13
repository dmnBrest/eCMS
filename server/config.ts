import * as fs from 'fs';
import * as path from 'path';

export interface IConfig {
    dbPath: string
}

export class AppConfig {

	private static instance: IConfig;
	private constructor() {}
	public static getInstance(): IConfig {
		if (!AppConfig.instance) {
			this.instance = JSON.parse(fs.readFileSync(path.join(__dirname, './../config.json'), 'utf8'));
			console.log('Config init');
			console.log(this.instance);
		}
		return this.instance;
	}

}
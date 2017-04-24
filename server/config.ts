import * as fs from 'fs';
import * as path from 'path';

export interface IConfig {
    dbPath: string,
    modules: string[],
    siteBaseUrl: string,
    siteTitle: string,
    adminEmail: string,
    noreplyEmail: string

}

console.log('Init config');

export const appConfig:IConfig = JSON.parse(fs.readFileSync(path.join(__dirname, './../config.json'), 'utf8'));
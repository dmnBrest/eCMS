import * as fs from 'fs';
import * as path from 'path';
import { IConfig } from './interfaces'

console.log('Init config');

export const appConfig:IConfig = JSON.parse(fs.readFileSync(path.join(__dirname, './../config.json'), 'utf8'));
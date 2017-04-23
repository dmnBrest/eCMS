import { IUser } from './../../common/interfaces';
import * as db from './db.service';
import * as UserService from './user.service';

export function isLoggedIn(req:any, res:any, next:any) {
	if (req.isAuthenticated())
		return next();
	res.redirect('/auth');
}

export function serializeUser(user: IUser, done: any) {
	let u = JSON.stringify(user);
	console.log('serializeUser: ', u);
	done(null, u);
}

export function deserializeUser(user:string, done:any) {
	let u = JSON.parse(user);
	if (u && u.id) {
		UserService.getUserByIdForLogin(u.id).then(
			user => {
				console.log('D1');
				console.log(user);
				done(null, user)
			}
		).catch(
			err => {
				console.log(err);
				done(null, null)
			}
		);
	} else {
		done(null, null);
	}
}
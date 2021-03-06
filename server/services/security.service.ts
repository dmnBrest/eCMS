import * as I from './../../server/interfaces';
import { db } from './db.service';
import * as UserService from './user.service';

export function isLoggedIn(req:any, res:any, next:any) {
	if (req.isAuthenticated())
		return next();
	res.redirect('/auth');
}

export function isAdmin(req:any, res:any, next:any) {
	if (req.isAuthenticated() && req.user.is_admin)
		return next();
	res.redirect('/');
}

export function serializeUser(user: I.IUser, done: any) {
	delete user.password;
	let u = JSON.stringify(user);
	done(null, u);
}

export async function deserializeUser(user:string, done:any) {
	let u = JSON.parse(user);
	if (u && u.id) {
		try {
			let user:I.UserInstance = await UserService.getUserByIdForLogin(u.id);
			done(null, user)
		} catch(err) {
			console.log(err);
			done(null, null);
		};
	} else {
		done(null, null);
	}
}
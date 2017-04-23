import { IUser } from './../../common/interfaces';
import * as db from './db.service';

export function getUserByIdForLogin(id: string) {
	return db.one('SELECT * FROM public.user WHERE id=$1 AND is_confirmed = true AND is_blocked = false', [id]).then((data:any) => {
		console.log('getUserById:');
		console.log(data);
		return data;
	})
}

export function getUserByEmail(email: string) {
	return db.one('SELECT * FROM public.user WHERE email=$1', [email]).then((data:any) => {
		console.log('getUserByEmail:');
		console.log(data);
		return data;
	})
}

export function saveUser(user: IUser) {
	return db.query('INSERT INTO public.user (email, username, password, created_at, slug) VALUES(${email}, ${username}, ${password}, ${created_at}, ${slug})', user).then((data:any) => {
		console.log('saveUser:');
		console.log(data);
		return data;
	});
}
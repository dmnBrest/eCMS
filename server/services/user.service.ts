import * as bcrypt from 'bcrypt';
import { v4 as uuidV4} from 'uuid';
import * as db from './db.service';
import { IUser } from './../../common/interfaces';

export function getUserByIdForLogin(id: string) {
	return db.one('SELECT * FROM public.user WHERE id=$1 AND verification_code IS NULL AND is_blocked = false', [id]).then((data:any) => {
		console.log('UserService.getUserById:');
		console.log(data);
		return data;
	})
}

export function getUserByEmail(email: string) {
	return db.one('SELECT * FROM public.user WHERE email=$1', [email]).then((data:any) => {
		console.log('UserService.getUserByEmail:');
		console.log(data);
		return data;
	})
}

export function createUser(username:string, email:string, password:string, isAdmin:boolean): Promise<IUser> {

	let hash = bcrypt.hashSync(password, 10);

	let verification_code = uuidV4();
	console.log(verification_code);

	let slug = username; // TODO generate unique

	let user:IUser = {
		id: null,
		username: username,
		email: email,
		password: hash,
		created_at: Math.floor(Date.now() / 1000),
		verification_code: verification_code,
		slug: slug,
		is_admin: false,
		is_blocked: false
	};

	return db.query('INSERT INTO public.user (email, username, password, created_at, slug, verification_code, is_admin, is_blocked) VALUES(${email}, ${username}, ${password}, ${created_at}, ${slug}, ${verification_code}, ${is_admin}, ${is_blocked})', user)
	.then((results:any) => {
		console.log('UserService.createUser:');
		console.log(results);
		return user;
	});
}

export function verifyEmail(email: string, code: string) {
	return db.one('UPDATE public.user SET verification_code=NULL WHERE email=$1 AND verification_code=$2 RETURNING id', [email, code]).then((data:any) => {
		console.log('UserService.verifyEmail:');
		console.log(data);
		return data;
	})
}
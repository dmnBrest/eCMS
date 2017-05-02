import * as bcrypt from 'bcrypt';
import { v4 as uuidV4} from 'uuid';
import * as db from './db.service';
import { IUser, INTERNAL_ERROR } from './../interfaces';

export function getUserById(id: number): Promise<IUser> {
	return db.one('SELECT * FROM public.user WHERE id=$1', [id])
	.then((data:IUser) => {
		console.log('UserService.getUserById:');
		console.log(data);
		return data;
	});
}

export function getUserByIdForLogin(id: number): Promise<IUser> {
	return db.one('SELECT id, username, email, is_admin, created_at, login_at, slug FROM public.user WHERE id=$1 AND verification_code IS NULL AND is_blocked = false', [id])
	.then((data:IUser) => {
		console.log('UserService.getUserByIdForLogin:');
		console.log(data);
		return data;
	});
}

export function getTotalByEmailOrUsername(email:string, username:string, excludeUserId: number): Promise<number> {
	return db.one('SELECT COUNT (*) FROM public.user WHERE (email=$1 OR username=$2) AND id!=$3', [email, username, excludeUserId])
	.then((res:any) => {
		console.log('UserService.getTotalByEmailOrUsername:');
		console.log(res.count);
		return res.count;
	}).catch((err) => {
		console.log(err);
		return null;
	});
}

export async function getTotalByEmailOrUsernameAsync(email:string, username:string, excludeUserId: number): Promise<number> {
	try {
		let res = await db.one('SELECT COUNT (*) FROM public.user WHERE (email=$1 OR username=$2) AND id!=$3', [email, username, excludeUserId]);
		console.log('UserService.getTotalByEmailOrUsername:');
		console.log(res.count);
		return res.count;
	} catch(err) {
		console.log(err);
		return null;
	};
}

export function getUserByEmail(email: string): Promise<IUser> {
	return db.one('SELECT * FROM public.user WHERE email=$1', [email])
	.then((data:IUser) => {
		console.log('UserService.getUserByEmail:');
		console.log(data);
		return data;
	});
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

export function changePassword(email:string, password:string, token: string): Promise<IUser> {
	return new Promise((resolve, reject) => {
		let hash = bcrypt.hashSync(password, 10);
		db.one('UPDATE public.user SET password=$1, reset_password_token=NULL WHERE email=$2 AND reset_password_token=$3 RETURNING id', [hash, email, token]).then((data:any) => {
			console.log('UserService.changePassword:');
			console.log(data);
			getUserByEmail(email).then((user) => {
				resolve(user);
			}).catch((err) => {
				console.log(err);
				reject(INTERNAL_ERROR);
			})

		}).catch((err) => {
			console.log(err);
			if (err.constructor.name =='QueryResultError') {
				reject('User with token not found');
			} else {
				reject(INTERNAL_ERROR);
			}
		});
	});
}

export function verifyEmail(email: string, code: string) {
	return db.one('UPDATE public.user SET verification_code=NULL WHERE email=$1 AND verification_code=$2 RETURNING id', [email, code]).then((data:any) => {
		console.log('UserService.verifyEmail:');
		console.log(data);
		return data;
	})
}

export function resetPassword(email: string): Promise<string> {
	let token = uuidV4();
	console.log('token: '+token);

	return db.one('UPDATE public.user SET reset_password_token=$1 WHERE email=$2 RETURNING id', [token, email]).then((data:any) => {
		console.log('UserService.resetPassword:');
		console.log(data);
		return token;
	})
}
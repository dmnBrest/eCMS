import * as bcrypt from 'bcrypt';
import { v4 as uuidV4} from 'uuid';
import * as db from './db.service';
import { IUser, INTERNAL_ERROR } from './../interfaces';

export async function getUserById(id: number): Promise<IUser> {
	try {
		let user:IUser = await db.one('SELECT * FROM public.user WHERE id=$1', [id])
		console.log('UserService.getUserById:');
		console.log(user);
		return user;
	} catch(err) {
		console.log(err);
		throw err;
	};
}

export async function getUsers(page: number, perPage: number):Promise<IUser[]> {
	try {
		let users:IUser[] = await db.query('SELECT * FROM public.user ORDER BY created_at DESC LIMIT $1 OFFSET $2', [perPage, (page-1)*perPage]);
		console.log('UserService.getUsers:');
		return users;
	} catch(err) {
		console.log(err);
		throw err;
	};
}

export async function getUserByIdForLogin(id: number): Promise<IUser> {
	try {
		let user:IUser = await db.one('SELECT id, username, email, is_admin, created_at, login_at, slug FROM public.user WHERE id=$1 AND verification_code IS NULL AND is_blocked = false', [id]);
		console.log('UserService.getUserByIdForLogin:');
		return user;
	} catch(err) {
		console.log(err);
		throw err;
	};
}

export async function getTotalByEmailOrUsername(email:string, username:string, excludeUserId: number): Promise<number> {
	try {
		excludeUserId = excludeUserId ? excludeUserId : 0;
		let res = await db.one('SELECT COUNT(*) FROM public.user WHERE (email=$1 OR username=$2) AND id!=$3', [email, username, excludeUserId]);
		console.log('UserService.getTotalByEmailOrUsername:');
		console.log(res.count);
		return res.count;
	} catch(err) {
		console.log(err);
		throw err;
	};
}

export async function getUserByEmail(email: string): Promise<IUser> {
	try {
		let user:IUser = await db.one('SELECT * FROM public.user WHERE email=$1', [email]);
		console.log('UserService.getUserByEmail:');
		console.log(user);
		return user;
	} catch(err) {
		console.log(err);
		throw err;
	};
}

export async function createUser(username:string, email:string, password:string, isAdmin:boolean): Promise<number> {

	let hash = bcrypt.hashSync(password, 10);

	let verification_code = uuidV4();
	console.log(verification_code);

	let slug = username;
	let counter = 1;
	try {
		let availableSlugs = await db.query('SELECT slug FROM public.user WHERE slug LIKE \'$1#%\'', [slug]);
		console.log('availableSlugs');
		console.log(availableSlugs)
		let slugSet = new Set();
		for (let s of availableSlugs) {
			slugSet.add(s.slug);
		}
		console.log(slugSet);
		let originalSlug = slug;
		console.log(slugSet.has(slug));
		while(slugSet.has(slug)) {
			slug = originalSlug + '-' + counter;
			counter++;
		}
		console.log(slug);
	} catch(err) {
		console.log(err);
		throw INTERNAL_ERROR;
	}

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

	try {
		let res = await db.one('INSERT INTO public.user (email, username, password, created_at, slug, verification_code, is_admin, is_blocked) VALUES(${email}, ${username}, ${password}, ${created_at}, ${slug}, ${verification_code}, ${is_admin}, ${is_blocked}) RETURNING id', user)
		console.log('UserService.createUser:');
		console.log(res);
		return res.id;
	} catch(err) {
		console.log(err);
		throw INTERNAL_ERROR;
	}
}

export async function changePasswordWithToken(email:string, password:string, token: string): Promise<number> {
	let hash = bcrypt.hashSync(password, 10);
	try {
		let res = await db.one('UPDATE public.user SET password=$1, reset_password_token=NULL WHERE email=$2 AND reset_password_token=$3 RETURNING id', [hash, email, token]);
		console.log('UserService.changePasswordWithToken:');
		console.log(res);
		return res.id;
	} catch(err) {
		console.log(err);
		if (err.constructor.name =='QueryResultError') {
			throw 'User with token not found';
		} else {
			throw INTERNAL_ERROR;
		}
	}
}

export async function updatePassword(userId: number, password:string): Promise<number> {
	let hash = bcrypt.hashSync(password, 10);
	try {
		let res = await db.one('UPDATE public.user SET password=$1, reset_password_token=NULL WHERE id=$2 RETURNING id', [hash, userId]);
		console.log('UserService.updatePassword:');
		console.log(res);
		return res.id;
	} catch(err) {
		console.log(err);
		if (err.constructor.name =='QueryResultError') {
			throw 'User not found';
		} else {
			throw INTERNAL_ERROR;
		}
	}
}

export async function verifyEmail(email: string, code: string) {
	try {
		let res = await db.one('UPDATE public.user SET verification_code=NULL WHERE email=$1 AND verification_code=$2 RETURNING id', [email, code]);
		console.log('UserService.verifyEmail:');
		console.log(res);
		return res.id;
	} catch(err) {
		console.log(err);
		if (err.constructor.name =='QueryResultError') {
			throw 'User with email or token not found';
		} else {
			throw INTERNAL_ERROR;
		}
	}
}

export async function resetPassword(email: string): Promise<string> {
	let token:string = uuidV4();
	console.log('token: '+token);
	try {
		let res = await db.one('UPDATE public.user SET reset_password_token=$1 WHERE email=$2 RETURNING id', [token, email]);
		console.log('UserService.resetPassword:');
		console.log(res);
		return token;
	} catch(err) {
		console.log(err);
		if (err.constructor.name =='QueryResultError') {
			throw 'User with email not found';
		} else {
			throw INTERNAL_ERROR;
		}
	}
}


export async function updateUsername(userId: number, username: string): Promise<number> {
	try {
		let res = await db.one('UPDATE public.user SET username=$1 WHERE id=$2 RETURNING id', [username, userId]);
		console.log('UserService.resetPassword:');
		console.log(res);
		return res.id;
	} catch(err) {
		console.log(err);
		if (err.constructor.name =='QueryResultError') {
			throw 'User with email not found';
		} else {
			throw INTERNAL_ERROR;
		}
	}
}
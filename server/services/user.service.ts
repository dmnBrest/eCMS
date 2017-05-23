import * as bcrypt from 'bcrypt';
import { v4 as uuidV4} from 'uuid';
import { User } from './db.service';
import * as I from './../interfaces';
import * as Slug from 'slug';

export async function getUserById(id: string): Promise<I.UserInstance> {
	let user:I.UserInstance;
	try {
		user = await User.findById(id);
	} catch(err) {
		console.log(err);
		throw I.INTERNAL_ERROR;
	};
	return user;
}

export async function setLoginAt(user: I.UserInstance) {
	user.login_at = Math.floor(Date.now() / 1000);
	user.save();
}

export async function getUsers(page: number, perPage: number):Promise<I.UserInstance[]> {
	let users:I.UserInstance[];
	try {
		let users = await User.findAll({
			offset: (page-1)*perPage,
			limit: perPage,
			order: 'created_at DESC'
		});
	} catch(err) {
		console.log(err);
		throw I.INTERNAL_ERROR;
	};
	return users;
}

export async function updateUser(userId: string, username: string): Promise<I.UserInstance> {
	let user:I.UserInstance;
	try {
		user = await User.findById(userId);
	} catch(err) {
		console.log(err);
		throw I.INTERNAL_ERROR;
	}
	if (user == null) {
		console.log('User with Id "'+userId+'" not found');
		throw I.INTERNAL_ERROR;
	}
	user.username = username;
	user.save();
	return user;
}

export async function getUserByIdForLogin(userId: string): Promise<I.UserInstance> {
	let user:I.UserInstance;
	try {
		user = await User.findOne({
			attributes: ['id', 'username', 'email', 'is_admin', 'is_writer', 'created_at', 'login_at', 'slug'],
			where: {
				id: userId,
				verification_code: null,
				is_blocked: false
			}
		});
	} catch(err) {
		console.log(err);
		throw I.INTERNAL_ERROR;
	};
	return user;
}

export async function getTotalByEmailOrUsername(email:string, username:string, excludeUserId: string): Promise<number> {
	let total:number;
	try {
		excludeUserId = excludeUserId ? excludeUserId : null;
		total = await User.count({
			where: {
				id: {
					$ne: excludeUserId
				},
				$or: [
					{
						email: email
					},
					{
						username: username
					}
				]
			}
		});
	} catch(err) {
		console.log(err);
		throw I.INTERNAL_ERROR;
	};
	return total;
}

export async function getUserByEmail(email: string): Promise<I.UserInstance> {
	let user:I.UserInstance;
	try {
		user = await User.findOne({
			where: {
				email: email
			}
		});
	} catch(err) {
		console.log(err);
		throw I.INTERNAL_ERROR;
	};
	return user;
}

export async function createUser(username:string, email:string, password:string, isAdmin:boolean): Promise<I.UserInstance> {

	let hash = bcrypt.hashSync(password, 10);
	let verification_code = uuidV4();

	// GENERATE SLUG
	let slug =  Slug(username, {lower: true});
	let counter = 1;
	let availableSlugs: I.UserInstance[];
	try {
		availableSlugs = await User.findAll({
			where: {
				slug: {
					$like: slug+'%'
				}
			}
		});
	} catch(err) {
		console.log(err);
		throw I.INTERNAL_ERROR;
	}

	let slugSet = new Set();
	for (let s of availableSlugs) {
		slugSet.add(s.slug);
	}
	let originalSlug = slug;
	while(slugSet.has(slug)) {
		slug = originalSlug + '-' + counter;
		counter++;
	}
	// END GENERATE SLUG

	let userObj:I.IUser = {
		username: username,
		email: email,
		password: hash,
		verification_code: verification_code,
		slug: slug,
		is_admin: false,
		is_blocked: false,
		is_writer: false
	};
	let user:I.UserInstance;
	try {
		user = await User.create(userObj);
	} catch(err) {
		console.log(err);
		throw I.INTERNAL_ERROR;
	}
	return user;
}

export async function changePasswordWithToken(email:string, password:string, token: string): Promise<I.UserInstance> {
	try {
		let hash = bcrypt.hashSync(password, 10);
		let user:I.UserInstance = await User.findOne({
			where: {
				email: email,
				reset_password_token: token
				// TODO reset_password_token_at < 1 day
			}
		});
		if (user == null) {
			throw 'User with email "'+email+'" and token "'+token+'" not found';
		}
		user.password = hash;
		user.reset_password_token = null;
		user.reset_password_token_at = null;
		user.save();
		return user;
	} catch(err) {
		console.log(err);
		throw I.INTERNAL_ERROR;
	}
}

export async function updatePassword(userId: string, password:string): Promise<I.UserInstance> {
	try {
		let hash = bcrypt.hashSync(password, 10);
		let user:I.UserInstance = await User.findOne({
			where: {
				id: userId
			}
		});
		if (user == null) {
			throw 'User with id "'+userId+'" not found';
		}
		user.password = hash;
		user.reset_password_token = null;
		user.reset_password_token_at = null;
		user.save;
		return user;
	} catch(err) {
		console.log(err);
		throw I.INTERNAL_ERROR;
	}
}

export async function verifyEmail(email: string, code: string): Promise<I.UserInstance> {
	try {
		let user: I.UserInstance = await User.findOne({
			where: {
				email: email,
				verification_code: code
			}
		});
		if (user == null) {
			throw 'User with email "'+email+'" and verification code "'+code+'" not found';
		}
		user.verification_code = null;
		user.save();
		return user;
	} catch(err) {
		console.log(err);
		throw I.INTERNAL_ERROR;
	}
}

export async function resetPassword(email: string): Promise<I.UserInstance> {
	try {
		let token:string = uuidV4();
		let user:I.UserInstance = await User.findOne({
			where: {
				email: email
			}
		});
		if (user == null) {
			throw 'User with email "'+email+'" not found';
		}
		user.reset_password_token = token;
		user.reset_password_token_at = Math.floor(Date.now() / 1000);
		user.save();
		return user;
	} catch(err) {
		console.log(err);
		throw I.INTERNAL_ERROR;
	}
}

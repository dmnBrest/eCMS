import *  as request from 'request-promise-native';
import { appConfig } from './../config';

export async function validateCaptcha(token: string): Promise<any> {
	let payload = {
		secret: appConfig.recaptchaSecret,
		response: token
	}
	let resp;
	try {
		resp = await request.post('https://www.google.com/recaptcha/api/siteverify', {form:payload}
);
	} catch(err) {
		console.log(err);
		throw err;
	}
	resp = JSON.parse(resp);
	if (!resp || resp.success != true) {
		throw 'Bad Captcha';
	} else {
		return resp;
	}
}
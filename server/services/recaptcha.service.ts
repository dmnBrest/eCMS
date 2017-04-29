import *  as request from 'request-promise-native';
import { appConfig } from './../config';

export function validateCaptcha(token: string): Promise<any> {
	let payload = {
		secret: appConfig.recaptchaSecret,
		response: token
	}
	return request.post('https://www.google.com/recaptcha/api/siteverify',
		{form:payload}
	).then( (resp: any) => {
		resp = JSON.parse(resp);
		if (!resp || resp.success != true) {
			throw 'Bad Captcha';
		} else {
			return resp;
		}
    })
    .catch(function (err) {
		console.log(err);
		throw err;
    });
}
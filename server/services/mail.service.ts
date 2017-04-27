import {createTransport, SentMessageInfo, Transporter, SendMailOptions} from 'nodemailer';
import { EmailTemplate } from 'email-templates';
import * as path from 'path';
import { IUser } from './../../server/interfaces';
import { appConfig } from './../config';

let mailTransport:Transporter = createTransport({
	port: 1025,
	ignoreTLS: true,
	// other settings...
});

// TODO Email Base (Header, Footer) template

export function sendNewUserEmail(user: IUser): Promise<SentMessageInfo> {

	return new Promise((resolve, reject) => {
		let templateDir = path.join(__dirname, '..', 'emails', 'new-user-email');
		let emailEngine = new EmailTemplate(templateDir)

		let verifyUrl = appConfig.baseUrl+'/auth/verify/'+encodeURIComponent(user.email)+'/'+encodeURIComponent(user.verification_code);

		emailEngine.render({user: user, verifyUrl: verifyUrl}, function (err, result) {

			if (err) {
				console.log(err);
				reject(err);
			}

			// setup email data with unicode symbols
			let mailOptions:SendMailOptions = {
				from: appConfig.noreplyEmail, // sender address
				to: user.email, // list of receivers
				subject: 'Welcome to '+appConfig.title, // Subject line
				html: result.html // html body
			};

			mailTransport.sendMail(mailOptions).then(
				(info: SentMessageInfo) => {resolve(info);}
			).catch(
				(err) => reject(err)
			);

		});
	});

}

export function sendResetPasswordEmail(email: string, token: string): Promise<SentMessageInfo> {

	return new Promise((resolve, reject) => {
		let templateDir = path.join(__dirname, '..', 'emails', 'reset-password-email');
		let emailEngine = new EmailTemplate(templateDir);

		let resetUrl = appConfig.baseUrl+'/auth#/change-password/'+encodeURIComponent(email)+'/'+encodeURIComponent(token);

		emailEngine.render({resetUrl: resetUrl, token: token}, function (err, result) {

			if (err) {
				console.log(err);
				reject(err);
			}

			// setup email data with unicode symbols
			let mailOptions:SendMailOptions = {
				from: appConfig.noreplyEmail, // sender address
				to: email, // list of receivers
				subject: 'Reset password token', // Subject line
				html: result.html // html body
			};

			mailTransport.sendMail(mailOptions).then(
				(info: SentMessageInfo) => {resolve(info);}
			).catch(
				(err) => reject(err)
			);

		});
	});

}
import {createTransport, SentMessageInfo, Transporter, SendMailOptions} from 'nodemailer';
import { EmailTemplate } from 'email-templates';
import * as path from 'path';

let mailTransport:Transporter = createTransport({
	port: 1025,
	ignoreTLS: true,
	// other settings...
});

// TODO https://github.com/crocodilejs/node-email-templates

export function sendNewUserEmail(): Promise<SentMessageInfo> {

	return new Promise((resolve, reject) => {
		let templateDir = path.join(__dirname, '..', 'emails', 'new-user-email');
		let emailEngine = new EmailTemplate(templateDir)

		var user = {username: 'Joe Doe'}
		emailEngine.render(user, function (err, result) {

			if (err) {
				throw err;
				//reject(err);
			}

			console.log(result.html);

			// setup email data with unicode symbols
			let mailOptions:SendMailOptions = {
				from: '"eCMS admin" <admin@ecms.test>', // sender address
				to: 'test1@test1.com', // list of receivers
				subject: 'Welcome to site', // Subject line
				//text: 'Hello world ?', // plain text body
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
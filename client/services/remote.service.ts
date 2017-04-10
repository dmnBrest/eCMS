import { ILoginForm } from './../../common/forms.interfaces';

export function authLoginFetch(form: ILoginForm) {
	return fetch('/auth/login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(form)
	}).then((response) => {
		console.log('authLoginFetch', response);
		return response.json()
	});
}
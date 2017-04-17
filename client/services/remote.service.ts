import { ILoginForm } from './../../common/interfaces';

export function loginFormFetch(form: ILoginForm) {
	return fetch('/auth/login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		credentials: 'include',
		body: JSON.stringify(form)
	}).then((response) => {
		console.log('authLoginFetch', response);
		return response.json()
	});
}
import * as StoreService from './store.service';
import { INTERNAL_ERROR } from './../../server/interfaces';

export function remoteAction(action: string, payload: any) {

	return fetch(action, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'csrf-token': (window as any).csrfToken
		},
		credentials: 'include',
		body: JSON.stringify(payload)
	})
	.then(checkResponseStatus)
	.then((response) => {
		console.log(':: RemoteAction:', response);
		if (response.json) {
			return response.json();
		} else {
			return response;
		}
	});
}

function checkResponseStatus(response:any) {
	if (response.status >= 200 && response.status < 300) {
		return response;
	} else {
		return response.json().then((resp:any) => {
			if (resp.errors) {
				StoreService.addErrors(resp.errors);
			} else {
				StoreService.addErrors([INTERNAL_ERROR]);
			}
			return resp;
		}).catch((err:any) => {
			StoreService.addErrors(['Bad response']);
		});
	}
}
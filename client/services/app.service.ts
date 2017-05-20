import * as RemoteService from './remote.service';
import { appStore } from './store.service';
import * as AppReducer from './app.reducer';
import * as I from './../../server/interfaces';

// ACTION CREATORS
export function loginFormSubmit(data: I.ILoginForm) {
	return new Promise((resolve, reject) => {
		removeAllNotifications();
		showSpinner();
		return RemoteService.remoteAction('/auth/login', data)
		.then((resp: I.IResults) => {
			hideSpinner();
			if (resp.status == I.ResultStatus.SUCCESS) {
				resolve(resp);
				window.location.href = '/';
			} else {
				reject(resp);
			}
		}).catch(function(ex) {
			hideSpinner();
			reject(ex);
		});
	});
}

export function registerFormSubmit(data: I.IRegisterForm) {
	return new Promise((resolve, reject) => {
		removeAllNotifications();
		showSpinner();
		return RemoteService.remoteAction('/auth/register', data)
		.then((resp: I.IResults) => {
			hideSpinner();
			if (resp.status == I.ResultStatus.SUCCESS) {
				window.location.href = '/';
				resolve(resp);
			} else {
				reject(resp);
			}
		}).catch(function(ex) {
			hideSpinner();
			reject(ex);
		});
	});
}

export function resetFormSubmit(data: I.IResetForm) {
	return new Promise((resolve, reject) => {
		removeAllNotifications();
		showSpinner();
		return RemoteService.remoteAction('/auth/reset', data)
		.then((resp: I.IResults) => {
			hideSpinner();
			if (resp.status == I.ResultStatus.SUCCESS) {
				window.location.href = '/';
				resolve(resp);
			} else {
				reject(resp);
			}
		}).catch(function(ex) {
			hideSpinner();
			reject(ex);
		});
	});
}

export function newPasswordFormSubmit(data: I.INewPasswordForm) {
	return new Promise((resolve, reject) => {
		removeAllNotifications();
		showSpinner();
		console.log(data);
		return RemoteService.remoteAction('/auth/change-password', data)
		.then((resp: I.IResults) => {
			hideSpinner();
			if (resp.status == I.ResultStatus.SUCCESS) {
				window.location.href = '/auth#/login';
				window.location.reload(true);
			} else {
				reject(resp);
			}
		}).catch(function(ex) {
			hideSpinner();
			reject(ex);
		});
	});
}

export function profileSettingsFormSubmit(data: I.ISettingsForm) {
	return new Promise((resolve, reject) => {
		removeAllNotifications();
		showSpinner();
		console.log(data);
		return RemoteService.remoteAction('/profile/save-settings', data)
		.then((resp: I.IResults) => {
			hideSpinner();
			if (resp.status == I.ResultStatus.SUCCESS) {
				setCurrentUser(resp.payload);
				resolve(resp);
			} else {
				reject(resp);
			}
		}).catch(function(ex) {
			hideSpinner();
			reject(ex);
		});
	});
}

export function initEmptyPost() {
	appStore.dispatch({ type: AppReducer.INIT_EMPTY_POST });
}

export function getPost(postId: number) {
	// TODO load by ID
	let post = null;
	appStore.dispatch({ type: AppReducer.SET_POST, payload: post });
}

export function savePost(post: I.IPost) {
	removeAllNotifications();
	showSpinner();
	RemoteService.remoteAction('/post/save', post).then((resp: I.IResults) => {
		hideSpinner();
		if (resp.status == I.ResultStatus.SUCCESS) {
			appStore.dispatch({ type: AppReducer.SET_POST, payload: resp.payload });
		}
	}).catch(function(ex) {
		hideSpinner();
	});
}

export async function generatePreview(post: I.IPost) {
	removeAllNotifications();
	showSpinner();
	RemoteService.remoteAction('/post/generate-preview', post).then((resp: I.IResults) => {
		hideSpinner();
		if (resp.status == I.ResultStatus.SUCCESS) {
			appStore.dispatch({ type: AppReducer.SET_POST, payload: resp.payload });
		}
	}).catch(function(ex) {
		hideSpinner();
	});
}

export function setCurrentUser(user:I.IUser) {
	appStore.dispatch({ type: AppReducer.SET_CURRENT_USER, payload: user });
}

export function showSpinner() {
	appStore.dispatch({ type: AppReducer.SHOW_SPINNER });
}

export function hideSpinner() {
	appStore.dispatch({ type: AppReducer.HIDE_SPINNER });
}

export function addErrors(errors: string[]) {
	appStore.dispatch({ type: AppReducer.ADD_ERRORS, payload: errors });
}

export function addInfo(errors: string[]) {
	appStore.dispatch({ type: AppReducer.ADD_INFO, payload: errors });
}

export function removeError(index: number) {
	appStore.dispatch({ type: AppReducer.REMOVE_ERROR, payload: index });
}

export function removeAllNotifications() {
	appStore.dispatch({ type: AppReducer.REMOVE_ALL_NOTIFICATIONS });
}

export function removeInfo(index: number) {
	appStore.dispatch({ type: AppReducer.REMOVE_INFO, payload: index });
}

window.onhashchange = function() {
	console.log('Hash updated: ', location.hash);
	appStore.dispatch({ type: AppReducer.UPDATE_HASH, payload: location.hash });
}

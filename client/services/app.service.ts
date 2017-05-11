import * as RemoteService from './remote.service';
import { appStore } from './store.service';
import * as AppReducer from './app.reducer';
import { IUser, ILoginForm, ISettingsForm, IRegisterForm, IResetForm, INewPasswordForm, IAppState, IAppAction, ResultStatus, IResults, INTERNAL_ERROR } from './../../server/interfaces';

// ACTION CREATORS
export function loginFormSubmit(data: ILoginForm) {
	return new Promise((resolve, reject) => {
		removeAllNotifications();
		showSpinner();
		return RemoteService.remoteAction('/auth/login', data)
		.then((resp: IResults) => {
			hideSpinner();
			if (resp.status == ResultStatus.SUCCESS) {
				//setCurrentUser(resp.payload);
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

export function registerFormSubmit(data: IRegisterForm) {
	return new Promise((resolve, reject) => {
		removeAllNotifications();
		showSpinner();
		return RemoteService.remoteAction('/auth/register', data)
		.then((resp: IResults) => {
			hideSpinner();
			if (resp.status == ResultStatus.SUCCESS) {
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

export function resetFormSubmit(data: IResetForm) {
	return new Promise((resolve, reject) => {
		removeAllNotifications();
		showSpinner();
		return RemoteService.remoteAction('/auth/reset', data)
		.then((resp: IResults) => {
			hideSpinner();
			if (resp.status == ResultStatus.SUCCESS) {
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

export function newPasswordFormSubmit(data: INewPasswordForm) {
	return new Promise((resolve, reject) => {
		removeAllNotifications();
		showSpinner();
		console.log(data);
		return RemoteService.remoteAction('/auth/change-password', data)
		.then((resp: IResults) => {
			hideSpinner();
			if (resp.status == ResultStatus.SUCCESS) {
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

export function profileSettingsFormSubmit(data: ISettingsForm) {
	return new Promise((resolve, reject) => {
		removeAllNotifications();
		showSpinner();
		console.log(data);
		return RemoteService.remoteAction('/profile/save-settings', data)
		.then((resp: IResults) => {
			hideSpinner();
			if (resp.status == ResultStatus.SUCCESS) {
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

export function getUsersForAdmin(page: number, usersPerPage: number) {
	return new Promise((resolve, reject) => {
		removeAllNotifications();
		showSpinner();
		console.log('page:', page, 'usersPerPage:', usersPerPage);
		return RemoteService.remoteAction('/admin/get-users', {page: page, usersPerPage: usersPerPage}).then((resp: IResults) => {
			hideSpinner();
			if (resp.status == ResultStatus.SUCCESS) {
				resolve(resp.payload);
			} else {
				reject(resp);
			}
		}).catch(function(ex) {
			hideSpinner();
			reject(ex);
		});
	});
}

export function setCurrentUser(user:IUser) {
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

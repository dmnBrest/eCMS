import { Action, applyMiddleware, Store, createStore, Dispatch } from 'redux';
import { createLogger } from 'redux-logger';
import * as RemoteService from './remote.service';
import { IUser, ILoginForm, ISettingsForm, IRegisterForm, IResetForm, INewPasswordForm, ISpinner, IAppState, IAppAction, ResultStatus, IResults, INTERNAL_ERROR } from './../../server/interfaces';

const loggerMiddleware = createLogger();

// INITIAL STATE
let initialState: IAppState = {
	errors: [],
	info: [],
	spinner: {
		show: false,
		counter: 0
	},
	currentUser: null
};
let initialStateFromServer = {};
if (document.getElementById("initialStateFromServer") != null) {
	console.log(document.getElementById("initialStateFromServer").innerHTML);
	initialStateFromServer = JSON.parse(document.getElementById("initialStateFromServer").innerHTML)
}

initialState = Object.assign({}, initialState, initialStateFromServer);

const SHOW_SPINNER = 'SHOW_SPINNER';
const HIDE_SPINNER = 'HIDE_SPINNER';
const ADD_ERRORS = 'ADD_ERRORS';
const ADD_INFO = 'ADD_INFO';
const REMOVE_ERROR = 'REMOVE_ERROR';
const REMOVE_ALL_NOTIFICATIONS = 'REMOVE_ALL_NOTIFICATIONS';
const REMOVE_INFO = 'REMOVE_INFO';
const SET_CURRENT_USER = 'SET_CURRENT_USER';
const AUTH_REGISTER__AJAX_START = 'AUTH_REGISTER__AJAX_START';
const AUTH_REGISTER__AJAX_END = 'AUTH_REGISTER__AJAX_END';

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
	appStore.dispatch({ type: SET_CURRENT_USER, payload: user });
}

export function showSpinner() {
	appStore.dispatch({ type: SHOW_SPINNER });
}

export function hideSpinner() {
	appStore.dispatch({ type: HIDE_SPINNER });
}

export function addErrors(errors: string[]) {
	appStore.dispatch({ type: ADD_ERRORS, payload: errors });
}

export function addInfo(errors: string[]) {
	appStore.dispatch({ type: ADD_INFO, payload: errors });
}

export function removeError(index: number) {
	appStore.dispatch({ type: REMOVE_ERROR, payload: index });
}

export function removeAllNotifications() {
	appStore.dispatch({ type: REMOVE_ALL_NOTIFICATIONS });
}

export function removeInfo(index: number) {
	appStore.dispatch({ type: REMOVE_INFO, payload: index });
}

// REDUCERS
function appReducer(lastState: IAppState, action: IAppAction): IAppState {
	let nextState:any = {};
	switch(action.type) {
		case SHOW_SPINNER:
			nextState.spinner = {
				show: true,
				counter: (lastState.spinner.counter ? lastState.spinner.counter : 0) + 1
			}
			return Object.assign({}, lastState, nextState);

		case HIDE_SPINNER:
			nextState.spinner = {
				show: false,
				counter: (lastState.spinner.counter ? lastState.spinner.counter : 0) - 1
			}
			return Object.assign({}, lastState, nextState);

		case ADD_ERRORS:
			nextState.errors = lastState.errors.concat(action.payload);
			return Object.assign({}, lastState, nextState);

		case ADD_INFO:
			nextState.info = lastState.info.concat(action.payload);
			return Object.assign({}, lastState, nextState);

		case REMOVE_ERROR:
			nextState = { errors: [
					...lastState.errors.slice(0, action.payload),
					...lastState.errors.slice(action.payload + 1)
				]
			};
			return Object.assign({}, lastState, nextState);

		case REMOVE_INFO:
			nextState = { info: [
					...lastState.info.slice(0, action.payload),
					...lastState.info.slice(action.payload + 1)
				]
			};
			return Object.assign({}, lastState, nextState);

		case REMOVE_ALL_NOTIFICATIONS:
			nextState = {
				info: [],
				errors: []
			}
			return Object.assign({}, lastState, nextState);

		case SET_CURRENT_USER:
			nextState = { currentUser: action.payload };
			return Object.assign({}, lastState, nextState);

	}
	return lastState;
}

// INIT STORE
export const appStore: Store<IAppState> =
	createStore(
		appReducer,
		initialState,
		applyMiddleware(loggerMiddleware) // TODO Remove for Production
	);




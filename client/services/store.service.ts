import { Action, applyMiddleware, Store, createStore, Dispatch } from 'redux';
let createLogger = require('redux-logger');

import { IUser, ILoginForm, ISpinner, IAppState, IAppAction } from './../../common/interfaces';

const loggerMiddleware = createLogger();


// INITIAL STATE (TODO: mix with remote on load)
let initialState: IAppState = {
	errors: [],
	spinner: {
		show: false,
		counter: 0
	},
	currentUser: null
};
// if ((window as any).initialState) {
// 	initialState = Object.assign({}, initialState, (window as any).initialState)
// }

const SHOW_SPINNER = 'SHOW_SPINNER'
const HIDE_SPINNER = 'HIDE_SPINNER'
const REMOVE_ERROR = 'REMOVE_ERROR'
const ADD_ERRORS = 'ADD_ERRORS'
const SET_CURRENT_USER = 'SET_CURRENT_USER'
const AUTH_REGISTER__AJAX_START = 'AUTH_REGISTER__AJAX_START'
const AUTH_REGISTER__AJAX_END = 'AUTH_REGISTER__AJAX_END'

// ACTION CREATORS
export function loginFormSubmit(data: ILoginForm) {
	return new Promise((resolve, reject) => {
		showSpinner();
		return remoteAction('/auth/login', data).then((resp: any) => {
			hideSpinner();
			if (resp.status == 'ok') {
				setCurrentUser(resp.currentUser);
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

export function setCurrentUser(user:IUser) {
	appStore.dispatch({ type: SET_CURRENT_USER, payload: user });
}

export function showSpinner() {
	appStore.dispatch({ type: SHOW_SPINNER });
}

export function hideSpinner() {
	appStore.dispatch({ type: HIDE_SPINNER });
}

export function addError(errors: string[]) {
	appStore.dispatch({ type: ADD_ERRORS, payload: errors });
}

export function removeError(index: number) {
	appStore.dispatch({ type: REMOVE_ERROR, payload: index });
}

// REDUCERS
function appReducer(lastState: IAppState, action: IAppAction): IAppState {
	let nextState:any = {};
	switch(action.type) {
		// Auth Action Handlers
		case SHOW_SPINNER:
			nextState.spinner = {
				show: false,
				counter: lastState.spinner.counter ? lastState.spinner.counter + 1 : 0
			}
			return Object.assign({}, lastState, nextState);

		case HIDE_SPINNER:
			nextState.spinner = {
				show: false,
				counter: lastState.spinner.counter ? lastState.spinner.counter - 1 : 0
			}
			return Object.assign({}, lastState, nextState);

		case ADD_ERRORS:
			nextState.errors = action.payload;
			return Object.assign({}, lastState, nextState);

		case REMOVE_ERROR:
			nextState = { errors: [
					...lastState.errors.slice(0, action.payload),
					...lastState.errors.slice(action.payload + 1)
				]
			};
			return Object.assign({}, lastState, nextState)

		case SET_CURRENT_USER:
			nextState = { currentUser: action.payload };
			return Object.assign({}, lastState, nextState)

		// case AUTH_REGISTER__AJAX_START:
		// 	return Object.assign({}, lastState, nextState);

		// case AUTH_REGISTER__AJAX_END:
		// 	return Object.assign({}, lastState, nextState);

	}
	return lastState;
}

// REMOTE HANDLER
export function remoteAction(action: string, payload: any) {
	return fetch(action, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		credentials: 'include',
		body: JSON.stringify(payload)
	})
	.then(checkResponseStatus)
	.then((response) => {
		console.log(':: RemoteAction:', response);
		return response.json()
	});
}

function checkResponseStatus(response:any) {
	console.log('R1: ', response);
	if (response.status >= 200 && response.status < 300) {
		return response;
	} else {
		response.json().then((resp:any) => {
			if (resp.errors) {
				addError(resp.errors);
			} else {
				addError(['Internal Server Error']);
			}
		}).catch((err:any) => {
			addError(['Bad response']);
		});
	}
}

// INIT STORE
export const appStore: Store<IAppState> = createStore(
										appReducer,
										initialState,
										applyMiddleware(
											loggerMiddleware
										));




import { Action, applyMiddleware, Store, createStore, Dispatch } from 'redux';
let createLogger = require('redux-logger');

import { IUser, ILoginForm, ISpinner, IAppState, IAppAction } from './../../common/interfaces';

import { loginFormFetch } from './remote.service'

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
if ((window as any).initialState) {
	initialState = Object.assign({}, initialState, (window as any).initialState)
}

const SHOW_SPINNER = 'SHOW_SPINNER'
const HIDE_SPINNER = 'HIDE_SPINNER'
const HANDLE_RESPONCE_ERRORS = 'HANDLE_RESPONCE_ERRORS'
const SET_CURRENT_USER = 'SET_CURRENT_USER'
const AUTH_REGISTER__AJAX_START = 'AUTH_REGISTER__AJAX_START'
const AUTH_REGISTER__AJAX_END = 'AUTH_REGISTER__AJAX_END'

// https://github.com/github/fetch

// ACTION CREATORS
export function loginFormSubmit(data: ILoginForm) {
	return new Promise((resolve, reject) => {
		console.log('loginFormSubmit', data);
		showSpinner();
		return loginFormFetch(data).then((json: any) => {
			hideSpinner();
			if (json.status == 'ok') {
				appStore.dispatch({ type: SET_CURRENT_USER, user: json.currentUser });
				resolve(json);
			} else {
				appStore.dispatch({ type: HANDLE_RESPONCE_ERRORS, response: json });
				reject(json);
			}
		}).catch(function(ex) {
			hideSpinner();
			console.log('authLoginFetch ERROR', ex);
			reject(ex);
		});
	});
}

export function showSpinner() {
	appStore.dispatch({ type: SHOW_SPINNER });
}

export function hideSpinner() {
	appStore.dispatch({ type: HIDE_SPINNER });
}

// REDUCERS
function appReducer(lastState: IAppState, action: IAppAction): IAppState {
	let nextState:any = {};
	switch(action.type) {
		// Auth Action Handlers
		case SHOW_SPINNER:
			nextState = {
				spinner: {
					show: true,
					counter: lastState.spinner.counter ?  lastState.spinner.counter + 1 : 0
				}
			}
			return Object.assign({}, lastState, nextState);

		case HIDE_SPINNER:
			nextState = {
				spinner: {
					show: false,
					counter: lastState.spinner.counter ? lastState.spinner.counter - 1 : 0
				}
			};
			return Object.assign({}, lastState, nextState);

		case HANDLE_RESPONCE_ERRORS:
			console.log(HANDLE_RESPONCE_ERRORS, action.response);
			if (action.response.errors) {
				nextState.errors = action.response.errors;
			}
			return Object.assign({}, lastState, nextState);

		case SET_CURRENT_USER:
			console.log('SET_CURRENT_USER', action.user);
			nextState = { currentUser: action.user };
			return Object.assign({}, lastState, nextState)

		case AUTH_REGISTER__AJAX_START:
			console.log('AUTH_REGISTER__AJAX_START');
			return Object.assign({}, lastState, nextState);

		case AUTH_REGISTER__AJAX_END:
			console.log('AUTH_REGISTER__AJAX_END');
			return Object.assign({}, lastState, nextState);

	}
	return lastState;
}

// INIT STORE
export const appStore: Store<IAppState> = createStore(
										appReducer,
										initialState,
										applyMiddleware(
											loggerMiddleware
										));




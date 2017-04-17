import { Action, applyMiddleware, Store, createStore, Dispatch } from 'redux';
let createLogger = require('redux-logger');

import { IUser, ILoginForm, ISpinner, IAppState, IAppAction } from './../../common/interfaces';

import { loginFormFetch } from './remote.service'

const loggerMiddleware = createLogger();


// INITIAL STATE (TODO: mix with remote on load)
let initialState: IAppState = {
	spinner: {
		show: false,
		counter: 0
	},
	currentUser: {
		id: null
	}
};
if ((window as any).initialState) {
	initialState = Object.assign({}, initialState, (window as any).initialState)
}

const AUTH_LOGIN__AJAX_START = 'AUTH_LOGIN__AJAX_START'
const AUTH_LOGIN__AJAX_END = 'AUTH_LOGIN__AJAX_END'
const AUTH_REGISTER__AJAX_START = 'AUTH_REGISTER__AJAX_START'
const AUTH_REGISTER__AJAX_END = 'AUTH_REGISTER__AJAX_END'

// https://github.com/github/fetch

// ACTION CREATORS
export function loginFormSubmit(data: ILoginForm) {
	return new Promise((resolve, reject) => {
		console.log('authLoginRemoteCall', data);
		store.dispatch({ type: AUTH_LOGIN__AJAX_START, form: data });
		return loginFormFetch(data).then((json) => {
			store.dispatch({ type: AUTH_LOGIN__AJAX_END, response: json });
			resolve(json);
		}).catch(function(ex) {
			console.log('authLoginFetch ERROR', ex)
			reject(ex);
		});
	});
}

// REDUCERS
function appReducer(lastState: IAppState, action: IAppAction): IAppState {
	let nextState = {};
	switch(action.type) {
		// Auth Action Handlers
		case AUTH_LOGIN__AJAX_START:
			console.log('AUTH_LOGIN__AJAX_START');
			console.log(action.form);
			//nextState[some] = lastState(some)

			return Object.assign({}, lastState, nextState)
		case AUTH_LOGIN__AJAX_END:
			console.log('AUTH_LOGIN__AJAX_END', action.response);

			nextState = { currentUser: action.response.currentUser }

			return Object.assign({}, lastState, nextState)
		case AUTH_REGISTER__AJAX_START:
			console.log('AUTH_REGISTER__AJAX_START');

			return Object.assign({}, lastState, nextState)
		case AUTH_REGISTER__AJAX_END:
			console.log('AUTH_REGISTER__AJAX_END');

			return Object.assign({}, lastState, nextState)

	}
	return lastState;
}

// INIT STORE
const store: Store<IAppState> = createStore(
										appReducer,
										initialState,
										applyMiddleware(
											loggerMiddleware
										));
(window as any).appStore = store;



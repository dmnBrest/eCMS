import { Action, applyMiddleware, Store, createStore, Dispatch } from 'redux';
import thunk from 'redux-thunk';
let createLogger = require('redux-logger');

import { IUser, ILoginForm, ISpinner } from './../../common/interfaces';

import { authLoginFetch } from './remote.service'

const loggerMiddleware = createLogger();

export interface IAppState {
	spinner: ISpinner;
	currentUser: IUser;
};

export interface IAppAction extends Action {
	form?: any;
	response?: any;
}

// INITIAL STATE (TODO: mix with remote on load)
const INITIAL_STATE: IAppState = {
	spinner: {
		show: false,
		counter: 0
	},
	currentUser: {
		id: null
	}
};

const AUTH_LOGIN = 'AUTH_LOGIN'
const AUTH_LOGIN_RESPONSE = 'AUTH_LOGIN_RESPONSE'
const AUTH_REGISTER = 'AUTH_REGISTER'
const AUTH_REGISTER_RESPONSE = 'AUTH_REGISTER_RESPONSE'

// https://github.com/github/fetch

// ACTION CREATORS
export function authLoginRemoteCall(data: ILoginForm) {
	return new Promise((resolve, reject) => {
		console.log('authLoginRemoteCall', data);
		store.dispatch((dispatch:Dispatch<IAppAction>) => {
			let action:IAppAction = { type: AUTH_LOGIN, form: data };
			dispatch(action);
			return authLoginFetch(data).then((json) => {
				authLoginResponseHandler(json);
				resolve(json);
			}).catch(function(ex) {
				console.log('authLoginFetch ERROR', ex)
				reject(ex);
			});
		});
	});
}

export function authLoginResponseHandler(response: any) {
	let action:IAppAction = { type: AUTH_LOGIN_RESPONSE, response: response };
	store.dispatch(action);
}

// REDUCERS
function appReducer(lastState: IAppState, action: IAppAction): IAppState {
	let nextState = {};
	switch(action.type) {
		// Auth Action Handlers
		case AUTH_LOGIN:
			console.log('AUTH_LOGIN');
			console.log(action.form);
			//nextState[some] = lastState(some)

			return Object.assign({}, lastState, nextState)
		case AUTH_LOGIN_RESPONSE:
			console.log('AUTH_LOGIN_RESPONSE', action.response);

			nextState = { currentUser: action.response.currentUser }

			return Object.assign({}, lastState, nextState)
		case AUTH_REGISTER:
			console.log('AUTH_REGISTER');

			return Object.assign({}, lastState, nextState)
		case AUTH_REGISTER_RESPONSE:


	}
	return lastState;
}

// INIT STORE
const store: Store<IAppState> = createStore(
										appReducer,
										INITIAL_STATE,
										applyMiddleware(
											thunk,
											loggerMiddleware
										));
(window as any).appStore = store;



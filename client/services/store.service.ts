import { Action, applyMiddleware, Store, createStore, Dispatch } from 'redux';
import thunk from 'redux-thunk';
let createLogger = require('redux-logger');

import { IUser } from './../../common/models';

const loggerMiddleware = createLogger();

export interface IAppState {
	count: number;
	currentUser: IUser;
};

export interface IAppAction extends Action {
	form?: any;
	response?: any;
}


const INITIAL_STATE: IAppState = {
	count: 0,
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
export function authLoginRemoteCall(form: any) {
	console.log('authLoginRemoteCall', form);
	store.dispatch((dispatch:Dispatch<IAppAction>) => {
		let action:IAppAction = { type: AUTH_LOGIN, form: form };
		dispatch(action);
		return fetch('/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(form)
			})
			.then((response) => {
				console.log(response);
				return response.json()})
			.then((json) => {
				authLoginResponseHandler(json)
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



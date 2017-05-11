import { IAppState, IAppAction } from './../../server/interfaces';

export const SHOW_SPINNER = 'SHOW_SPINNER';
export const UPDATE_HASH = 'UPDATE_HASH';
export const HIDE_SPINNER = 'HIDE_SPINNER';
export const ADD_ERRORS = 'ADD_ERRORS';
export const ADD_INFO = 'ADD_INFO';
export const REMOVE_ERROR = 'REMOVE_ERROR';
export const REMOVE_INFO = 'REMOVE_INFO';
export const REMOVE_ALL_NOTIFICATIONS = 'REMOVE_ALL_NOTIFICATIONS';
export const SET_CURRENT_USER = 'SET_CURRENT_USER';
export const AUTH_REGISTER__AJAX_START = 'AUTH_REGISTER__AJAX_START';
export const AUTH_REGISTER__AJAX_END = 'AUTH_REGISTER__AJAX_END';

// REDUCERS
export function appReducer(lastState: IAppState = {}, action: IAppAction): IAppState {
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

		case UPDATE_HASH:
			nextState = { hash: action.payload };
			return Object.assign({}, lastState, nextState);

	}
	return lastState;
}

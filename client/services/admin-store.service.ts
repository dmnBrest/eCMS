import { Action, applyMiddleware, Store, createStore, Dispatch } from 'redux';
import { createLogger } from 'redux-logger';
import * as StoreService from './store.service';
import * as RemoteService from './remote.service';
import { IAdminState, IAppAction, ResultStatus, IResults, INTERNAL_ERROR } from './../../server/interfaces';

const loggerMiddleware = createLogger();

// INITIAL STATE
let initialState: IAdminState = {
	users: {
		page: 1,
		list: null,
		perPage: 3,
		total: 0
	}
};

const USERS_SET = 'USERS_SET';
const USERS_NEXT_PAGE = 'USERS_NEXT_PAGE';
const USERS_PREV_PAGE = 'USERS_PREV_PAGE';

// ACTION CREATORS
export function getUsers(page: number, usersPerPage: number) {
	return new Promise((resolve, reject) => {
		StoreService.removeAllNotifications();
		StoreService.showSpinner();
		console.log('page:', page, 'usersPerPage:', usersPerPage);
		return RemoteService.remoteAction('/admin/get-users', {page: page, usersPerPage: usersPerPage}).then((resp: IResults) => {
			StoreService.hideSpinner();
			if (resp.status == ResultStatus.SUCCESS) {
				resolve(resp.payload);
			} else {
				reject(resp);
			}
		}).catch(function(ex) {
			StoreService.hideSpinner();
			reject(ex);
		});
	});
}

// REDUCERS
function appReducer(lastState: IAdminState, action: IAppAction): IAdminState {
	let nextState:any = {};
	switch(action.type) {
		case USERS_SET:
			nextState.users = Object.assign({}, lastState.users);
			nextState.users.list = action.payload.users;
			nextState.users.total = Math.ceil(action.payload.totalUsers / nextState.users.perPage);
			return Object.assign({}, lastState, nextState);

	}
	return lastState;
}

// INIT STORE
export const adminStore: Store<IAdminState> =
	createStore(
		appReducer,
		initialState,
		applyMiddleware(loggerMiddleware) // TODO Remove for Production
	);




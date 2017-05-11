import { createLogger } from 'redux-logger';
import { IAdminState, IAppAction } from './../../server/interfaces';

export const USERS_SET = 'USERS_SET';
export const USERS_NEXT_PAGE = 'USERS_NEXT_PAGE';
export const USERS_PREV_PAGE = 'USERS_PREV_PAGE';

// REDUCERS
export function adminReducer(lastState: IAdminState = {}, action: IAppAction): IAdminState {
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




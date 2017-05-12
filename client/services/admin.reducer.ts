import { createLogger } from 'redux-logger';
import * as I from './../../server/interfaces';

export const SET_OBJECTS_LIST = 'OBJECTS_LIST_SET';
export const OBJECTS_LIST_NEXT_PAGE = 'OBJECTS_LIST_NEXT_PAGE';
export const OBJECTS_LIST_PREV_PAGE = 'OBJECTS_LIST_PREV_PAGE';

// REDUCERS
export function adminReducer(lastState: I.IAdminState = {}, action: I.IAppAction): I.IAdminState {
	let nextState:any = {};
	switch(action.type) {
		case SET_OBJECTS_LIST:
			nextState[action.payload.object] = action.payload;
			return Object.assign({}, lastState, nextState);
		case OBJECTS_LIST_NEXT_PAGE:
			nextState[action.payload.objName] = Object.assign({}, lastState[action.payload.objName]);
			nextState[action.payload.objName].page++;
			return Object.assign({}, lastState, nextState);
		case OBJECTS_LIST_PREV_PAGE:
			nextState[action.payload.objName] = Object.assign({}, lastState[action.payload.objName]);
			nextState[action.payload.objName].page--;
			return Object.assign({}, lastState, nextState);
	}
	return lastState;
}




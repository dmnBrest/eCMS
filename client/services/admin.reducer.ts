import { createLogger } from 'redux-logger';
import * as I from './../../server/interfaces';

export const SET_OBJECTS_LIST = 'SET_OBJECTS_LIST';
export const RESET_OBJECT_LIST = 'RESET_OBJECT_LIST';
export const OBJECTS_LIST_NEXT_PAGE = 'OBJECTS_LIST_NEXT_PAGE';
export const OBJECTS_LIST_PREV_PAGE = 'OBJECTS_LIST_PREV_PAGE';
export const SET_EMPTY_SELECTED_TOPIC = 'SET_EMPTY_SELECTED_TOPIC';
export const SET_SELECTED_TOPIC = 'SET_SELECTED_TOPIC';
export const REMOVE_SELECTED_TOPIC = 'REMOVE_SELECTED_TOPIC';

// REDUCERS
export function adminReducer(lastState: I.IAdminState = {}, action: I.IAppAction): I.IAdminState {
	let nextState:I.IAdminState = {};
	switch(action.type) {
		case SET_OBJECTS_LIST:
			nextState.listViews = Object.assign({}, lastState.listViews);
			nextState.listViews[action.payload.object] = action.payload;
			return Object.assign({}, lastState, nextState);
		case RESET_OBJECT_LIST:
			nextState.listViews = Object.assign({}, lastState.listViews);
			if (nextState.listViews[action.payload.objType]) {
				nextState.listViews[action.payload.objType].page = 1;
			}
			return Object.assign({}, lastState, nextState);
		case OBJECTS_LIST_NEXT_PAGE:
			nextState.listViews = Object.assign({}, lastState.listViews);
			nextState.listViews[action.payload.objType].page++;
			return Object.assign({}, lastState, nextState);
		case OBJECTS_LIST_PREV_PAGE:
			nextState.listViews =  Object.assign({}, lastState.listViews);
			nextState.listViews[action.payload.objType].page--;
			return Object.assign({}, lastState, nextState);
		case SET_EMPTY_SELECTED_TOPIC:
			nextState.selectedTopic = {
				title: null,
				order: 0,
				image_ids: [],
			};
			return Object.assign({}, lastState, nextState);
		case SET_SELECTED_TOPIC:
			nextState.selectedTopic = action.payload;
			return Object.assign({}, lastState, nextState);
		case REMOVE_SELECTED_TOPIC:
			nextState.selectedTopic = null
			return Object.assign({}, lastState, nextState);
	}
	return lastState;
}




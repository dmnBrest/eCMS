import { appStore } from './store.service';
import * as AppService from './app.service';
import * as AdminReducers from './admin.reducer';
import * as RemoteService from './remote.service';
import * as I from './../../server/interfaces';

// ACTION CREATORS
export function getObjects(objName:string) {
	return new Promise((resolve, reject) => {
		AppService.removeAllNotifications();
		AppService.showSpinner();
		let state:I.IListViewState = appStore.getState().admin[objName];
		if (!state) {
			// INIT LISTVIEW STATE FOR OBJECT
			state = {
				object: objName,
				page: 1,
				perPage: 3,
				totalPages: 0,
				list: null
			}
		}
		return RemoteService.remoteAction('/admin/get-objects', state).then((resp: I.IResults) => {
			AppService.hideSpinner();
			if (resp.status == I.ResultStatus.SUCCESS) {
				appStore.dispatch({type: AdminReducers.SET_OBJECTS_LIST, payload: resp.payload});
				resolve(resp.payload);
			} else {
				reject(resp);
			}
		}).catch(function(ex) {
			AppService.hideSpinner();
			reject(ex);
		});
	});
}

export function prevPage(objName:string) {
	appStore.dispatch({ type: AdminReducers.OBJECTS_LIST_PREV_PAGE, payload: {objName: objName} });
	getObjects(objName);
}

export function nextPage(objName:string) {
	appStore.dispatch({ type: AdminReducers.OBJECTS_LIST_NEXT_PAGE, payload: {objName: objName} });
	getObjects(objName);
}

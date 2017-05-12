import { appStore } from './store.service';
import * as AppService from './app.service';
import * as AdminReducers from './admin.reducer';
import * as RemoteService from './remote.service';
import * as I from './../../server/interfaces';

// ACTION CREATORS
export let getObjects = (objType:string) => {
	AppService.removeAllNotifications();
	AppService.showSpinner();
	let state:I.IListViewState = Object.assign({}, appStore.getState().admin.listViews[objType]);
	if (!state.object) {
		// INIT LISTVIEW STATE FOR OBJECT
		state = {
			object: objType,
			page: 1,
			perPage: 30,
			totalPages: 0,
			list: null
		}
	}

	delete state.list;

	return RemoteService.remoteAction('/admin/get-objects', state).then((resp: I.IResults) => {
		AppService.hideSpinner();
		if (resp.status == I.ResultStatus.SUCCESS) {
			appStore.dispatch({type: AdminReducers.SET_OBJECTS_LIST, payload: resp.payload});
		}
	}).catch(function(ex) {
		AppService.hideSpinner();
	});
}

export let prevPage = (objType:string) => {
	appStore.dispatch({ type: AdminReducers.OBJECTS_LIST_PREV_PAGE, payload: {objType: objType} });
	getObjects(objType);
}

export let nextPage = (objType:string) => {
	appStore.dispatch({ type: AdminReducers.OBJECTS_LIST_NEXT_PAGE, payload: {objType: objType} });
	getObjects(objType);
}

let getObjectById = async (objType:string, id:number) => {
	AppService.removeAllNotifications();
	AppService.showSpinner();

	return RemoteService.remoteAction('/admin/get-object-by-id', {objType: objType, id: id}).then((resp: I.IResults) => {
		AppService.hideSpinner();
		if (resp.status == I.ResultStatus.SUCCESS) {
			return resp.payload;
		}
		return null;
	}).catch((err) => {
		AppService.hideSpinner();
		throw err
	});
}

export let selectedTopic = async (topicId:number) => {
	console.log('topicId', topicId);
	let topic;
	try {
		topic = await getObjectById('topic', topicId);
		console.log('topic', topic);
		appStore.dispatch({type: AdminReducers.SET_SELECTED_TOPIC, payload: topic});
	} catch(err) {
		console.log(err);
	}
}

export let newSelectedTopic = () => {
	appStore.dispatch({type: AdminReducers.SET_EMPTY_SELECTED_TOPIC});
}

export let saveTopic = (topic:I.ITopic) => {
	AppService.removeAllNotifications();
	AppService.showSpinner();
	RemoteService.remoteAction('/admin/save-topic', topic).then((resp: I.IResults) => {
		AppService.hideSpinner();
		if (resp.status == I.ResultStatus.SUCCESS) {
			appStore.dispatch({type: AdminReducers.REMOVE_SELECTED_TOPIC});
			appStore.dispatch({type: AdminReducers.RESET_OBJECT_LIST, payload: {objType: 'topic'}});
			getObjects('topic');
			location.hash = '#/topics';
		}
	}).catch(function(ex) {
		AppService.hideSpinner();
	});
}
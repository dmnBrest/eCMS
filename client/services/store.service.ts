import { Action, applyMiddleware, Store, createStore, Dispatch, combineReducers } from 'redux';
import { createLogger } from 'redux-logger';
import * as RemoteService from './remote.service';
import { appReducer } from './app.reducer';
import { adminReducer } from './admin.reducer';
import { IUser, ILoginForm, ISettingsForm, IRegisterForm, IResetForm, INewPasswordForm, IAppState, IAdminState, IState, IAppAction, ResultStatus, IResults, INTERNAL_ERROR } from './../../server/interfaces';

const loggerMiddleware = createLogger();

// INITIAL STATE
let initialAppState: IAppState = {
	hash: location.hash,
	errors: [],
	info: [],
	spinner: {
		show: false,
		counter: 0
	},
	currentUser: null,
};
let initialAdminState: IAdminState = {
	listViews: {}
};
let initialAppStateFromServer = {};
if (document.getElementById("initialStateFromServer") != null) {
	console.log(document.getElementById("initialStateFromServer").innerHTML);
	initialAppStateFromServer = JSON.parse(document.getElementById("initialStateFromServer").innerHTML)
}
initialAppState = Object.assign({}, initialAppState, initialAppStateFromServer);

// INIT STORE
let reducers = combineReducers<IState>({
	app: appReducer,
	admin: adminReducer
})

let initialState:IState = {
	app: initialAppState,
	admin: initialAdminState
}

export const appStore: Store<IState> =
	createStore(
		reducers,
		initialState,
		applyMiddleware(loggerMiddleware) // TODO Remove for Production
	);


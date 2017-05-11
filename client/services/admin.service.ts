import { appStore } from './store.service';
import * as AppService from './app.service';
import * as AdminReducers from './admin.reducer';
import * as RemoteService from './remote.service';
import { IUser, ILoginForm, ISettingsForm, IRegisterForm, IResetForm, INewPasswordForm, IAppState, IAppAction, ResultStatus, IResults, INTERNAL_ERROR } from './../../server/interfaces';

// ACTION CREATORS
export function getUsers() {
	return new Promise((resolve, reject) => {
		AppService.removeAllNotifications();
		AppService.showSpinner();
		let state = appStore.getState();
		return RemoteService.remoteAction('/admin/get-users', {page: state.admin.users.page, usersPerPage: state.admin.users.perPage})
		.then((resp: IResults) => {
			AppService.hideSpinner();
			if (resp.status == ResultStatus.SUCCESS) {
				appStore.dispatch({ type: AdminReducers.USERS_SET, payload: resp.payload });
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

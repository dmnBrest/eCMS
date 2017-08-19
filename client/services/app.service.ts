import * as RemoteService from './remote.service';
import { appStore } from './store.service';
import * as AppReducer from './app.reducer';
import * as I from './../../server/interfaces';

// ACTION CREATORS
export function loginFormSubmit(data: I.ILoginForm) {
	return new Promise((resolve, reject) => {
		removeAllNotifications();
		showSpinner();
		return RemoteService.remoteAction('/auth/login', data)
		.then((resp: I.IResults) => {
			hideSpinner();
			if (resp.status == I.ResultStatus.SUCCESS) {
				resolve(resp);
				window.location.href = '/';
			} else {
				reject(resp);
			}
		}).catch(function(ex) {
			hideSpinner();
			reject(ex);
		});
	});
}

export function registerFormSubmit(data: I.IRegisterForm) {
	return new Promise((resolve, reject) => {
		removeAllNotifications();
		showSpinner();
		return RemoteService.remoteAction('/auth/register', data)
		.then((resp: I.IResults) => {
			hideSpinner();
			if (resp.status == I.ResultStatus.SUCCESS) {
				window.location.href = '/';
				resolve(resp);
			} else {
				reject(resp);
			}
		}).catch(function(ex) {
			hideSpinner();
			reject(ex);
		});
	});
}

export function resetFormSubmit(data: I.IResetForm) {
	return new Promise((resolve, reject) => {
		removeAllNotifications();
		showSpinner();
		return RemoteService.remoteAction('/auth/reset', data)
		.then((resp: I.IResults) => {
			hideSpinner();
			if (resp.status == I.ResultStatus.SUCCESS) {
				window.location.href = '/';
				resolve(resp);
			} else {
				reject(resp);
			}
		}).catch(function(ex) {
			hideSpinner();
			reject(ex);
		});
	});
}

export function newPasswordFormSubmit(data: I.INewPasswordForm) {
	return new Promise((resolve, reject) => {
		removeAllNotifications();
		showSpinner();
		console.log(data);
		return RemoteService.remoteAction('/auth/change-password', data)
		.then((resp: I.IResults) => {
			hideSpinner();
			if (resp.status == I.ResultStatus.SUCCESS) {
				window.location.href = '/auth#/login';
				window.location.reload(true);
			} else {
				reject(resp);
			}
		}).catch(function(ex) {
			hideSpinner();
			reject(ex);
		});
	});
}

export function profileSettingsFormSubmit(data: I.ISettingsForm) {
	return new Promise((resolve, reject) => {
		removeAllNotifications();
		showSpinner();
		console.log(data);
		return RemoteService.remoteAction('/profile/save-settings', data)
		.then((resp: I.IResults) => {
			hideSpinner();
			if (resp.status == I.ResultStatus.SUCCESS) {
				setCurrentUser(resp.payload);
				resolve(resp);
			} else {
				reject(resp);
			}
		}).catch(function(ex) {
			hideSpinner();
			reject(ex);
		});
	});
}

export function initEmptyPost() {
	appStore.dispatch({ type: AppReducer.INIT_EMPTY_POST });
}

export function initEmptyComment() {
	appStore.dispatch({ type: AppReducer.INIT_EMPTY_COMMENT });
}

export function getPost(postId: string) {
	// TODO load by ID

	let post:I.IPost;
	RemoteService.remoteAction('/post/get', {postId: postId}).then((resp: I.IResults) => {
		if (resp.status == I.ResultStatus.SUCCESS) {
			//appStore.dispatch({ type: AppReducer.SET_POST, payload: resp.payload });
			appStore.dispatch({ type: AppReducer.SET_POST, payload: (resp.payload as I.IPost) });
		} else {
			hideSpinner();
		}
	}).catch(function(ex) {
		hideSpinner();
	});
}

export function savePost(post: I.IPost) {
	removeAllNotifications();
	showSpinner();
	RemoteService.remoteAction('/post/save', post).then((resp: I.IResults) => {
		if (resp.status == I.ResultStatus.SUCCESS) {
			//appStore.dispatch({ type: AppReducer.SET_POST, payload: resp.payload });
			console.log(resp.payload);
			location.href = '/post-'+resp.payload.slug;
		} else {
			hideSpinner();
		}
	}).catch(function(ex) {
		hideSpinner();
	});
}

export async function getComment() {

}

export async function saveComment(comment:I.IComment):Promise<I.IComment> {
	removeAllNotifications();
	showSpinner();
	let resp:I.IResults;
	try {
		resp = await RemoteService.remoteAction('/comment/save', comment);
	} catch(err) {
		hideSpinner();
		return null;
	};
	if (resp.status == I.ResultStatus.SUCCESS) {
		console.log(resp.payload);
		return resp.payload;
	} else {
		hideSpinner();
		return null;
	}
}

export async function generatePreview(post: I.IPost) {
	removeAllNotifications();
	showSpinner();
	RemoteService.remoteAction('/post/generate-preview', post).then((resp: I.IResults) => {
		hideSpinner();
		if (resp.status == I.ResultStatus.SUCCESS) {
			appStore.dispatch({ type: AppReducer.SET_PREVIEW, payload: resp.payload });
		}
	}).catch(function(ex) {
		hideSpinner();
	});
}

/* IMAGE GALLERY */
export function initGallery(component: any) {
	console.log('init Gallery Component');
	(window as any).galleryComponent = component;
}

export function openImageGallery() {
	if ((window as any).galleryComponent) {
		(window as any).galleryComponent.openGallery();
	}
}

export function getImages(search: string) {
	removeAllNotifications();
	showSpinner();
	return RemoteService.remoteAction('/gallery/images', {search: search}).then((resp: I.IResults) => {
		hideSpinner();
		if (resp.status == I.ResultStatus.SUCCESS) {
			return resp.payload;
		}
	}).catch(function(ex) {
		hideSpinner();
	});
}
/* end IMAGE GALLERY */

export function setCurrentUser(user:I.IUser) {
	appStore.dispatch({ type: AppReducer.SET_CURRENT_USER, payload: user });
}

export function showSpinner() {
	appStore.dispatch({ type: AppReducer.SHOW_SPINNER });
}

export function hideSpinner() {
	appStore.dispatch({ type: AppReducer.HIDE_SPINNER });
}

export function addErrors(errors: string[]) {
	appStore.dispatch({ type: AppReducer.ADD_ERRORS, payload: errors });
}

export function addInfo(errors: string[]) {
	appStore.dispatch({ type: AppReducer.ADD_INFO, payload: errors });
}

export function removeError(index: number) {
	appStore.dispatch({ type: AppReducer.REMOVE_ERROR, payload: index });
}

export function removeAllNotifications() {
	appStore.dispatch({ type: AppReducer.REMOVE_ALL_NOTIFICATIONS });
}

export function removeInfo(index: number) {
	appStore.dispatch({ type: AppReducer.REMOVE_INFO, payload: index });
}

window.onhashchange = function() {
	console.log('Hash updated: ', location.hash);
	appStore.dispatch({ type: AppReducer.UPDATE_HASH, payload: location.hash });
}

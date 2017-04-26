import { Component, OnInit, OnDestroy,  NgZone } from '@angular/core';
import * as StoreService from './../../../services/store.service';

import { ILoginForm, IAppState } from './../../../../common/interfaces';

@Component({
	selector: 'c-login',
	templateUrl: './login.component.html'
})

export class LoginComponent implements OnInit, OnDestroy {

	loginFormData:ILoginForm = {
		email: null,
		password: null
	};

	constructor() {}

	ngOnInit(): void {}

	ngOnDestroy() {}

	login() {
		StoreService.loginFormSubmit(this.loginFormData).then((results: any) => {
			if (results.status == 'ok') {
				window.location.href = '/';
			}
		}).catch(err => {
			console.log('Login Error');
		});
	}

}
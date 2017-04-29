import { Component, OnInit, OnDestroy,  NgZone } from '@angular/core';
import * as StoreService from './../../services/store.service';

import { ILoginForm, IAppState } from './../../../server/interfaces';

@Component({
	selector: 'c-login',
	templateUrl: './login.component.html'
})

export class LoginComponent implements OnInit, OnDestroy {

	loginFormData:ILoginForm;

	constructor() {
		this.loginFormData = {
			email: null,
			password: null
		};
	}

	ngOnInit(): void {}

	ngOnDestroy() {}

	login() {
		StoreService.loginFormSubmit(this.loginFormData).then((results: any) => {
			window.location.href = '/';
		}).catch(err => {
			console.log('Login Error');
		});
	}

}
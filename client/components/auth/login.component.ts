import { Component, OnInit, OnDestroy,  NgZone } from '@angular/core';
import * as StoreService from './../../services/app.service';

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
			password: null,
			rememberme: false
		};
	}

	ngOnInit() {}

	ngOnDestroy() {}

	login() {
		StoreService.loginFormSubmit(this.loginFormData);
	}

}
import { Component, OnInit, ViewChild } from '@angular/core';
import { IRegisterForm } from './../../../server/interfaces';
import * as StoreService from './../../services/app.service';
import { ReCaptchaComponent } from 'angular2-recaptcha';

@Component({
	selector: 'c-register',
	templateUrl: './register.component.html'
})

export class RegisterComponent implements OnInit {

	@ViewChild(ReCaptchaComponent) captcha: ReCaptchaComponent;
	recaptchaKey = (window as any).recaptchaKey;
	registerFormData:IRegisterForm;

	constructor() {
		this.registerFormData = {
			username: null,
			email: null,
			password: null,
			token: null
		}
	}

	// https://github.com/xmaestro/angular2-recaptcha
	handleCorrectCaptcha(token:string) {
		this.registerFormData.token = token;
	}

	register() {
		StoreService.registerFormSubmit(this.registerFormData);
	}

	ngOnInit(): void {

	}

}
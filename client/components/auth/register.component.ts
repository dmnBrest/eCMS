import { Component, OnInit } from '@angular/core';
import { IRegisterForm } from './../../../server/interfaces';
import * as StoreService from './../../services/store.service';

@Component({
	selector: 'c-register',
	templateUrl: './register.component.html'
})

export class RegisterComponent implements OnInit {

	registerFormData:IRegisterForm;

	constructor() {
		this.registerFormData = {
			username: null,
			email: null,
			password: null
		}
	}

	register() {
		StoreService.registerFormSubmit(this.registerFormData).then((results: any) => {
			window.location.href = '/';
		}).catch(err => {
			console.log('Login Error');
			console.log(err);
		});
	}

	ngOnInit(): void {

	}

}
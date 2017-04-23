import { Component, OnInit } from '@angular/core';
import { IRegisterForm } from './../../../../common/interfaces';
import { registerFormSubmit } from './../../../services/store.service';

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
		registerFormSubmit(this.registerFormData).then((results: any) => {
			if (results.status == 'ok') {
				window.location.href = '/';
			}
		}).catch(err => {
			console.log('Login Error');
			console.log(err);
		});
	}

	ngOnInit(): void {

	}

}
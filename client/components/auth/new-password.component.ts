import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as StoreService from './../../services/app.service';
import { INewPasswordForm } from './../../../server/interfaces';


@Component({
	selector: 'c-new-password',
	templateUrl: './new-password.component.html'
})

export class NewPasswordComponent implements OnInit, OnDestroy {

	email: string;
	token: string;
	private routeSubscription: any;
	newPasswordFormData:INewPasswordForm;

	constructor(private route: ActivatedRoute) {
		this.newPasswordFormData = {
			password: null,
			confirmPassword: null,
			email: null,
			token: null
		};
	}

	ngOnInit() {
		this.routeSubscription = this.route.params.subscribe(params => {
			this.newPasswordFormData.email = params['email'];
			this.newPasswordFormData.token = params['token'];
		});
	}

	ngOnDestroy() {
		this.routeSubscription.unsubscribe();
	}

	changePassword() {
		StoreService.newPasswordFormSubmit(this.newPasswordFormData);
	}

}
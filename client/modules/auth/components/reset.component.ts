import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as StoreService from './../../../services/store.service';
import { IResetForm } from './../../../../common/interfaces';


@Component({
	selector: 'c-reset',
	templateUrl: './reset.component.html'
})

export class ResetComponent implements OnInit, OnDestroy {

	email: string;
	token: string;
	private sub: any;

	constructor(private route: ActivatedRoute) {}

	ngOnInit() {
		// this.sub = this.route.params.subscribe(params => {
		// 	this.email = params['email'];
		// 	this.token = params['token'];
		// });
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}

	resetFormData:IResetForm = {
		email: null
	};


	reset() {
		StoreService.resetFormSubmit(this.resetFormData).then((results: any) => {
			if (results.status == 'ok') {
				window.location.href = '/';
			}
		}).catch(err => {
			console.log('Reset Error');
		});
	}

}
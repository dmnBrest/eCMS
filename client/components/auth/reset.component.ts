import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as StoreService from './../../services/store.service';
import { IResetForm } from './../../../server/interfaces';


@Component({
	selector: 'c-reset',
	templateUrl: './reset.component.html'
})

export class ResetComponent implements OnInit, OnDestroy {

	resetFormData:IResetForm;

	constructor(private route: ActivatedRoute) {
		this.resetFormData = {
			email: null
		};
	}

	ngOnInit() {}

	ngOnDestroy() {}

	reset() {
		StoreService.resetFormSubmit(this.resetFormData).then((results: any) => {
			window.location.href = '/';
		}).catch(err => {
			console.log('Reset Error');
		});
	}

}
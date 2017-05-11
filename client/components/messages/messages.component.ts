import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgZone } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { IAppState } from './../../../server/interfaces';
import { NgRedux, select } from '@angular-redux/store';
import * as StoreService from './../../services/app.service'

import { appStore } from './../../services/store.service'

declare const toastr: any;

@Component({
	selector: 'messages-component',
	templateUrl: './messages.component.html',
	styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit, OnDestroy {

	errors: string[];
	errorsSubscription: Subscription;
	info: string[];
	infoSubscription: Subscription;

	constructor(private ngRedux: NgRedux<IAppState>, private zone:NgZone) {
		this.ngRedux.provideStore(appStore);
		this.errorsSubscription = this.ngRedux.select<string[]>(['app', 'errors']).subscribe((val) => {
			this.zone.run(() => {
				this.errors = val;
				console.log('ZZZZZ');
				console.log(val);
				for (let m of this.errors) {
					toastr.error(m);
				}
			});
		});
		this.errorsSubscription = this.ngRedux.select<string[]>(['app', 'info']).subscribe((val) => {
			this.zone.run(() => {
				this.info = val;
				for (let m of this.info) {
					toastr.info(m);
				}
			});
		});
	}

	removeError(index:number) {
		StoreService.removeError(index);
	}

	removeInfo(index:number) {
		StoreService.removeInfo(index);
	}

	ngOnInit() {}

	ngOnDestroy() {
		this.errorsSubscription.unsubscribe();
	}

}
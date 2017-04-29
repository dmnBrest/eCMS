import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgZone } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { IAppState } from './../../../server/interfaces';
import { NgRedux, select } from '@angular-redux/store';
import * as StoreService from './../../services/store.service'

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
		this.ngRedux.provideStore(StoreService.appStore);
		this.errorsSubscription = this.ngRedux.select<string[]>('errors').subscribe((val) => {
			this.zone.run(() => {
				this.errors = val;
			});
		});
		this.errorsSubscription = this.ngRedux.select<string[]>('info').subscribe((val) => {
			this.zone.run(() => {
				this.info = val;
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
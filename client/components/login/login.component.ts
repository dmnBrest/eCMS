import { Component, OnInit, OnDestroy, Renderer, ElementRef, ViewChild, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { IAppState, IUser } from './../../../server/interfaces';
import { NgRedux, select } from '@angular-redux/store';
import * as StoreService from './../../services/app.service'

import { appStore } from './../../services/store.service'

@Component({
	selector: 'login-component',
	templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit, OnDestroy {

	user: IUser;
	userSubscription: Subscription;

	constructor(private ngRedux: NgRedux<IAppState>, private zone:NgZone, private rd: Renderer) {
		this.userSubscription = this.ngRedux.select<IUser>(['app', 'currentUser']).subscribe((user) => {
			this.zone.run(() => {
				this.user = user;
			});
		});
	}

	ngOnInit() {}

	ngOnDestroy() {
		this.userSubscription.unsubscribe();
	}

}
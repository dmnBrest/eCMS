import { Component, OnInit, OnDestroy,  NgZone } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import * as StoreService from './../../services/app.service';
import { IAppState, IUser } from './../../../server/interfaces';

@Component({
	selector: 'c-dashboard',
	templateUrl: './dashboard.component.html'
})

export class DashboardComponent implements OnInit, OnDestroy {

	user: IUser;
	currentUserSubscription: Subscription;

	constructor(private ngRedux: NgRedux<IAppState>, private zone:NgZone) {
		this.currentUserSubscription = this.ngRedux.select<IUser>(['app', 'currentUser']).subscribe((user) => {
			this.zone.run(() => {
				this.user = user;
			});
		});
	}
	ngOnInit() {}

	ngOnDestroy() {
		this.currentUserSubscription.unsubscribe();
	}

	getDashboarData() {
		// TODO ...
	}

}
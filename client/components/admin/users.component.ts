import { Component, OnInit, OnDestroy,  NgZone } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import * as AdminStoreService from './../../services/admin.service';
import { IAppState, IUser, IColumn, ColumnTypes } from './../../../server/interfaces';

@Component({
	selector: 'c-users',
	templateUrl: './users.component.html'
})

export class UsersComponent implements OnInit, OnDestroy {

	state: any;
	stateSubscription: Subscription;

	columns:IColumn[] = [
		{name: 'id', label: 'Id', type: ColumnTypes.STRING},
		{name: 'username', label: 'Username', type: ColumnTypes.STRING},
		{name: 'email', label: 'Email', type: ColumnTypes.STRING},
		{name: 'created_at', label: 'Created Date', type: ColumnTypes.DATE},
	]

	constructor(private ngRedux: NgRedux<IAppState>, private zone:NgZone) {
		// STATE SUBSCRIPTION
		this.stateSubscription = this.ngRedux.select<any>(['admin','users']).subscribe((val) => {
			this.zone.run(() => {
				this.state = val;
				console.log('state', this.state);
				if (!this.state.list) {
					this.getUsers();
				}
			});
		});

	}
	ngOnInit() {
		//this.getUsers();
	}

	getUsers() {
		AdminStoreService.getUsers();
	}

	editUser(user:IUser) {
		console.log(user);
	}

	prevPage() {
		AdminStoreService.usersPrevPage();
	}

	nextPage() {
		AdminStoreService.usersNextPage();
	}

	ngOnDestroy() {
		this.stateSubscription.unsubscribe();
	}

	getDashboarData() {
		// TODO ...
	}

}
import { Component, OnInit, OnDestroy,  NgZone } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import * as AdminStoreService from './../../services/admin.service';
import * as I from './../../../server/interfaces';

@Component({
	selector: 'c-users',
	templateUrl: './users.component.html'
})

export class UsersComponent implements OnInit, OnDestroy {

	state: any;
	stateSubscription: Subscription;

	columns:I.IField[] = [
		{name: 'id', label: 'Id', type: I.FieldTypes.STRING},
		{name: 'username', label: 'Username', type: I.FieldTypes.STRING},
		{name: 'email', label: 'Email', type: I.FieldTypes.STRING},
		{name: 'slug', label: 'Slug', type: I.FieldTypes.STRING},
		{name: 'created_at', label: 'Created Date', type: I.FieldTypes.DATE},
	]

	constructor(private ngRedux: NgRedux<I.IAppState>, private zone:NgZone) {
		// STATE SUBSCRIPTION
		this.stateSubscription = this.ngRedux.select<any>(['admin', 'listViews', 'user']).subscribe((val) => {
			this.zone.run(() => {
				this.state = val;
				console.log('state', this.state);
				if (!this.state) {
					this.getUsers();
				}
			});
		});

	}
	ngOnInit() {}

	getUsers() {
		AdminStoreService.getObjects('user');
	}

	editUser(user:I.IUser) {
		console.log(user);
	}

	prevPage() {
		AdminStoreService.prevPage('user');
	}

	nextPage() {
		AdminStoreService.nextPage('user');
	}

	ngOnDestroy() {
		this.stateSubscription.unsubscribe();
	}

}
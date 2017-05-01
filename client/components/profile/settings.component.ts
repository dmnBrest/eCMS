import { Component, OnInit, OnDestroy,  NgZone } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import * as StoreService from './../../services/store.service';

import { IAppState, ISettingsForm, IUser } from './../../../server/interfaces';

@Component({
	selector: 'c-settings',
	templateUrl: './settings.component.html'
})

export class SettingsComponent implements OnInit, OnDestroy {

	settingsFormData: ISettingsForm;
	currentUserSubscription: Subscription;

	constructor(private ngRedux: NgRedux<IAppState>, private zone:NgZone) {
		this.settingsFormData = {
			username: null,
			email: null,
			changePassword: false,
			password: null,
			confirmPassword: null,
			oldPassword: null
		};
		this.currentUserSubscription = this.ngRedux.select<IUser>('currentUser').subscribe((user) => {
			this.zone.run(() => {
				this.settingsFormData.username = user.username;
				this.settingsFormData.email = user.email;
			});
		});
	}

	ngOnInit() {}

	ngOnDestroy() {
		this.currentUserSubscription.unsubscribe();
	}

	saveSettings() {
		StoreService.profileSettingsFormSubmit(this.settingsFormData).then((results: any) => {
			StoreService.addInfo(['Settings updated successfully.']);
		}).catch(err => {
			console.log('Registration Error');
			console.log(err);
		});
	}

}
import { Component, OnInit, OnDestroy,  NgZone } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import * as StoreService from './../../services/app.service';

import { IAppState, ISettingsForm, IUser, IResetForm } from './../../../server/interfaces';

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
		this.currentUserSubscription = this.ngRedux.select<IUser>(['app', 'currentUser']).subscribe((user) => {
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

	resetPassword() {
		let resetData:IResetForm = {
			email: this.settingsFormData.email
		}
		StoreService.resetFormSubmit(resetData).then((results: any) => {
			StoreService.addInfo(['Password Reset Token was sent to your email.']);
		}).catch(err => {
			console.log('Reset Error');
		});
	}

	saveSettings() {
		StoreService.profileSettingsFormSubmit(this.settingsFormData).then((results: any) => {
			StoreService.addInfo(['Settings updated successfully.']);
		}).catch(err => {
			console.log('Registration Error');
		});
	}

}
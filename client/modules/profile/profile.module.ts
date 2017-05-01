import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { NgModule, NgZone, OnDestroy } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { RouterModule, Routes, Router, NavigationStart } from '@angular/router';
import { Component } from '@angular/core';

import * as jQuery from 'jquery';

import { StoreModule, provideStore } from '@ngrx/store';
import { NgReduxModule, NgRedux } from '@angular-redux/store';

import { DashboardComponent } from './../../components/profile/dashboard.component';
import { PersonalInfoComponent } from './../../components/profile/personal-info.component';
import { TopicsComponent } from './../../components/profile/topics.component';
import { SettingsComponent } from './../../components/profile/settings.component';

import { IAppState, IUser } from './../../../server/interfaces';

import { appStore } from './../../services/store.service'

/* MODULE COMPONENT */
@Component({
	selector: 'profile-module',
	templateUrl: './profile.module.html',
	styleUrls: ['./profile.module.css']
})
class ModuleComponent {

	user: IUser;
	userSubscription: Subscription;

	constructor(private ngRedux: NgRedux<IAppState>, private zone:NgZone) {
		this.ngRedux.provideStore(appStore);
		this.userSubscription = this.ngRedux.select<IUser>('currentUser').subscribe((val) => {
			this.zone.run(() => {
				this.user = val;
			});
		});
	}

}

/* MODULE */
const routes: Routes = [
	{ path: 'dashboard', component: DashboardComponent },
	{ path: 'personal-info', component: PersonalInfoComponent },
	{ path: 'topics', component: TopicsComponent },
	{ path: 'settings', component: SettingsComponent },
	{ path: '**', redirectTo: '/dashboard', pathMatch: 'full' },
];

@NgModule({
	imports: [
		BrowserModule,
		FormsModule,
		RouterModule.forRoot(routes, { useHash: true }),
		NgReduxModule
	],
	declarations: [
		ModuleComponent,
		DashboardComponent,
		PersonalInfoComponent,
		TopicsComponent,
		SettingsComponent
	],
	providers: [

	],
	bootstrap: [ ModuleComponent ]
})
class MainModule { }

/* BOOTSTRAP */
platformBrowserDynamic().bootstrapModule(MainModule);

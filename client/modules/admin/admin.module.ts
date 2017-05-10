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

import { DashboardComponent } from './../../components/admin/dashboard.component';
import { UsersComponent } from './../../components/admin/users.component';
import { ListViewComponent } from './../../components/list-view/list-view.component';

import { IAppState, IUser } from './../../../server/interfaces';

import { appStore } from './../../services/store.service'

/* MODULE COMPONENT */
@Component({
	selector: 'admin-module',
	templateUrl: './admin.module.html',
	styleUrls: ['./admin.module.css']
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

let routes: Routes = [
	{ path: 'dashboard', component: DashboardComponent },
	{ path: 'users', component: UsersComponent },
	{ path: '**', redirectTo: '/dashboard', pathMatch: 'full' }
];

/* MODULE */
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
		UsersComponent,
		ListViewComponent
	],
	providers: [

	],
	bootstrap: [ ModuleComponent ]
})
class MainModule { }

/* BOOTSTRAP */
platformBrowserDynamic().bootstrapModule(MainModule);

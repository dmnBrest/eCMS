import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Component, NgModule, NgZone, OnInit, OnDestroy } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import * as jQuery from 'jquery';

import { StoreModule, provideStore } from '@ngrx/store';
import { NgReduxModule, NgRedux } from '@angular-redux/store';

import { DashboardComponent } from './../../components/admin/dashboard.component';
import { UsersComponent } from './../../components/admin/users.component';
import { ListViewComponent } from './../../components/list-view/list-view.component';
import { OutputComponent } from './../../components/output/output.component';

import { IAppState, IUser } from './../../../server/interfaces';

import { appStore } from './../../services/store.service';

/* MODULE COMPONENT */
@Component({
	selector: 'admin-module',
	templateUrl: './admin.module.html',
	styleUrls: ['./admin.module.css']
})
class ModuleComponent implements OnInit, OnDestroy {

	route: string;
	mode: string;
	routeSubscription: Subscription;

	constructor(private ngRedux: NgRedux<IAppState>,  private zone:NgZone) {
		this.ngRedux.provideStore(appStore);

		// ROUTING
		this.routeSubscription = this.ngRedux.select<string>(['app', 'hash']).subscribe((val) => {
			this.zone.run(() => {
				this.route = val;
				if (this.route == '#/dashboard') {
					this.mode = 'dashboard';
				} else if (this.route == '#/users') {
					this.mode = 'users';
				} else {
					this.mode = null;
					location.hash = '#/dashboard';
				}

			});
		});
	}

	ngOnInit() {}

	ngOnDestroy() {}

}


/* MODULE */
@NgModule({
	imports: [
		BrowserModule,
		FormsModule,
		NgReduxModule
	],
	declarations: [
		ModuleComponent,
		DashboardComponent,
		UsersComponent,
		ListViewComponent,
		OutputComponent
	],
	providers: [

	],
	bootstrap: [ ModuleComponent ]
})
class MainModule { }

/* BOOTSTRAP */
platformBrowserDynamic().bootstrapModule(MainModule);

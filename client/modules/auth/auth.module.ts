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

import { ReCaptchaModule } from 'angular2-recaptcha';

import { LoginComponent } from './../../components/auth/login.component';
import { RegisterComponent } from './../../components/auth/register.component';
import { ResetComponent } from './../../components/auth/reset.component';
import { NewPasswordComponent } from './../../components/auth/new-password.component';


import { IUser, IAppState } from './../../../server/interfaces';

import { appStore } from './../../services/store.service'

/* MODULE COMPONENT */
@Component({
	selector: 'auth-module',
	templateUrl: './auth.module.html'
})
class ModuleComponent implements OnDestroy {

	currentUrl: string;

	constructor(
		private router: Router,
		private ngRedux: NgRedux<IAppState>,
	) {
		this.ngRedux.provideStore(appStore);
		this.router.events.subscribe(event => {
			if(event instanceof NavigationStart) {
				this.currentUrl = event.url.split('/')[1];
			}
		});
	}

	ngOnDestroy() {}

}

/* MODULE */
const routes: Routes = [
	{ path: 'login', component: LoginComponent },
	{ path: 'register', component: RegisterComponent },
	{ path: 'reset', component: ResetComponent },
	{ path: 'change-password/:email/:token', component: NewPasswordComponent },
	{ path: '**', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
	imports: [
		BrowserModule,
		FormsModule,
		RouterModule.forRoot(routes, { useHash: true }),
		NgReduxModule,
		ReCaptchaModule
	],
	declarations: [
		ModuleComponent,
		LoginComponent,
		RegisterComponent,
		ResetComponent,
		NewPasswordComponent
	],
	providers: [

	],
	bootstrap: [ ModuleComponent ]
})
class MainModule { }

/* BOOTSTRAP */
platformBrowserDynamic().bootstrapModule(MainModule);

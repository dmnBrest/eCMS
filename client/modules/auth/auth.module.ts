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

import { LoginComponent } from './../../components/auth/login.component';
import { RegisterComponent } from './../../components/auth/register.component';
import { ResetComponent } from './../../components/auth/reset.component';
import { NewPasswordComponent } from './../../components/auth/new-password.component';

import { NgReduxModule, NgRedux } from '@angular-redux/store';

import { IUser, IAppState } from './../../../server/interfaces';

import { appStore } from './../../services/store.service'

/* APP COMPONENT */
@Component({
	selector: 'app-auth',
	templateUrl: './auth.module.html'
})
class AppComponent implements OnDestroy {

	currentUrl: string;
	currentUser: IUser;
	currentUserSubscription: Subscription;

	constructor(
		private router: Router,
		private ngRedux: NgRedux<IAppState>,
		private zone:NgZone
	) {
		this.router.events.subscribe(event => {
			if(event instanceof NavigationStart) {
				this.currentUrl = event.url.split('/')[1];
				console.log(this.currentUrl);
			}
		});
		this.ngRedux.provideStore(appStore);
		this.currentUserSubscription = this.ngRedux.select<IUser>('currentUser').subscribe((c) => {
			this.zone.run(() => {
				console.log(c);
				this.currentUser = c;
			});
		})
	}

	ngOnDestroy() {
		this.currentUserSubscription.unsubscribe();
	}

}

/* APP MODULE */
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
		NgReduxModule
	],
	declarations: [
		AppComponent,
		LoginComponent,
		RegisterComponent,
		ResetComponent,
		NewPasswordComponent
	],
	providers: [

	],
	bootstrap: [ AppComponent ]
})
class AppModule { }

/* APP BOOTSTRAP */
platformBrowserDynamic().bootstrapModule(AppModule);

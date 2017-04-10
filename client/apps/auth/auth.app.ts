import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { NgModule, NgZone, OnDestroy } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { RouterModule, Routes, Router, NavigationStart } from '@angular/router';
import { Component } from '@angular/core';

import { StoreModule, provideStore } from '@ngrx/store';

import { LoginComponent } from './components/login.component';
import { RegisterComponent } from './components/register.component';
import { IAppState } from './../../services/store.service';

import { NgReduxModule, NgRedux } from '@angular-redux/store';

import { IUser } from './../../../common/interfaces';

/* APP COMPONENT */
@Component({
	selector: 'app-auth',
	templateUrl: './auth.app.html'
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
				console.log(event);
				console.log(event.url);
				this.currentUrl = event.url;
			}
		});
		this.ngRedux.provideStore((window as any).appStore);
		this.currentUserSubscription = this.ngRedux.select<IUser>('currentUser').subscribe((c) => {
			this.zone.run(() => {
				console.log(c);
				this.currentUser = c;
			});
		})
	}

	ngOnDestroy() {
		console.log('login.component destroy');
		this.currentUserSubscription.unsubscribe();
	}

}

/* APP MODULE */
const routes: Routes = [
	{ path: 'login', component: LoginComponent },
	{ path: 'register', component: RegisterComponent },
	{ path: '**', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
	imports: [
		BrowserModule,
		FormsModule,
		HttpModule,
		RouterModule.forRoot(routes, { useHash: true }),
		NgReduxModule
	],
	declarations: [
		AppComponent,
		LoginComponent,
		RegisterComponent
	],
	providers: [
		//{provide: StoreService, useValue: (window as any).storeService}
	],
	bootstrap: [ AppComponent ]
})
class AppModule { }

/* APP BOOTSTRAP */

platformBrowserDynamic().bootstrapModule(AppModule);

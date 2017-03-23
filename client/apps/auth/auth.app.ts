import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes, Router, NavigationStart } from '@angular/router';
import { Component } from '@angular/core';

import { StoreModule, provideStore } from '@ngrx/store';

import { LoginComponent } from './components/login.component';
import { RegisterComponent } from './components/register.component';
import { StoreService } from './../../services/store.service';

import { NgReduxModule } from '@angular-redux/store';

/* APP COMPONENT */
@Component({
	selector: 'app-auth',
	templateUrl: './auth.app.html'
})
class AppComponent {

	currentUrl: string;

	constructor(private router: Router) {
		this.router.events.subscribe(event => {
			if(event instanceof NavigationStart) {
				console.log(event);
				console.log(event.url);
				this.currentUrl = event.url;
			}
		});
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

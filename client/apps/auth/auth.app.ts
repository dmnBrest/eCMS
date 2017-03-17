import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { Component } from '@angular/core';

import { LoginComponent } from './components/login.component';
import { RegisterComponent } from './components/register.component';
import { SharedService } from './../../services/shared.service';

/* APP COMPONENT */
@Component({
	selector: 'app-auth',
	template: `
		<a routerLink="/login" routerLinkActive="active-link">Login</a>
		<a routerLink="/register" routerLinkActive="active-link">Register</a>
		<router-outlet></router-outlet>
	`
})
class AppComponent {
	title = 'Auth App ...';
}

/* APP MODULE */
const routes: Routes = [
	{ path: 'login', component: LoginComponent },
	{ path: 'register', component: RegisterComponent },
	{ path: '', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
	imports: [
		BrowserModule,
		FormsModule,
		HttpModule,
		RouterModule.forRoot(routes, { useHash: true })
	],
	declarations: [
		AppComponent,
		LoginComponent,
		RegisterComponent
	],
	providers: [
		{provide: SharedService, useValue: (window as any).sharedService}
	],
	bootstrap: [ AppComponent ]
})
class AppModule { }

/* APP BOOTSTRAP */

platformBrowserDynamic().bootstrapModule(
	AppModule
);

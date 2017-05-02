import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { NgModule, NgZone } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { IAppState, IUser } from './../../../server/interfaces';

import { NgReduxModule, NgRedux } from '@angular-redux/store';
import { select } from '@angular-redux/store';

import { LoginComponent } from './../../components/login/login.component';

/* MODULE COMPONENT */
@Component({
	selector: 'login-module',
	template: '<login-component></login-component>'
})
class ModuleComponent {

	user: IUser;

	constructor(private ngRedux: NgRedux<IAppState>, private zone:NgZone) {
		ngRedux.provideStore((window as any).appStore);
	}

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
		LoginComponent
	],
	providers: [

	],
	bootstrap: [ ModuleComponent ]
})
class MainModule { }


/* MODULE BOOTSTRAP */
platformBrowserDynamic().bootstrapModule(
	MainModule
);


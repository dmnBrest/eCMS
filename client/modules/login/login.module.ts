import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Component } from '@angular/core';

import { IAppState } from './../../../server/interfaces';

import { NgReduxModule, NgRedux } from '@angular-redux/store';

import { appStore } from './../../services/store.service'

import { LoginComponent } from './../../components/login/login.component';

/* MODULE COMPONENT */
@Component({
	selector: 'login-module',
	template: '<login-component></login-component>'
})
class ModuleComponent {

	constructor(private ngRedux: NgRedux<IAppState>) {
		ngRedux.provideStore(appStore);
	}

}

/* MODULE */
@NgModule({
	imports: [
		BrowserModule,
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


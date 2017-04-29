import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Component } from '@angular/core';

import { NgReduxModule } from '@angular-redux/store';
import { SpinnerComponent } from './../../components/spinner/spinner.component';

/* MODULE COMPONENT */
@Component({
	selector: 'spinner-module',
	template: `<spinner-component></spinner-component>`
})
class ModuleComponent {
	constructor() {}
}

/* MODULE */
@NgModule({
	imports: [
		BrowserModule,
		NgReduxModule
	],
	declarations: [
		ModuleComponent,
		SpinnerComponent
	],
	providers: [

	],
	bootstrap: [ ModuleComponent ]
})
class MainModule {}

/* BOOTSTRAP */
platformBrowserDynamic().bootstrapModule(
	MainModule
);


import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Component } from '@angular/core';

import { NgReduxModule } from '@angular-redux/store';
import { MessagesComponent } from './../../components/messages/messages.component';

/* MODULE COMPONENT */
@Component({
	selector: 'messages-module',
	template: `<messages-component></messages-component>`
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
		MessagesComponent
	],
	providers: [

	],
	bootstrap: [ ModuleComponent ]
})
class MainModule {}


/* APP BOOTSTRAP */
platformBrowserDynamic().bootstrapModule(
	MainModule
);


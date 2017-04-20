import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { NgModule, NgZone } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { IAppState } from './../../../common/interfaces';

import { NgReduxModule, NgRedux } from '@angular-redux/store';
import { select } from '@angular-redux/store';

/* APP COMPONENT */
@Component({
	selector: 'app-login',
	template: `
		<h1>X APP LOGIN X</h1>
	`
})
class AppComponent {

	constructor(private ngRedux: NgRedux<IAppState>, private zone:NgZone) {
		ngRedux.provideStore((window as any).appStore);
	}

}

/* APP MODULE */
@NgModule({
	imports: [
		BrowserModule,
		FormsModule,
		NgReduxModule
	],
	declarations: [
		AppComponent
	],
	providers: [

	],
	bootstrap: [ AppComponent ]
})
class AppModule { }


/* APP BOOTSTRAP */
platformBrowserDynamic().bootstrapModule(
	AppModule
);


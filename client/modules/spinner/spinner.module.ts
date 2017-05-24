import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Component, NgZone } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { NgReduxModule, NgRedux, select } from '@angular-redux/store';
import { appStore } from './../../services/store.service'
import * as I from './../../../server/interfaces';


import { SpinnerComponent } from './../../components/spinner/spinner.component';

/* MODULE COMPONENT */
@Component({
	selector: 'spinner-module',
	template: `<spinner-component [spinner]="spinner"></spinner-component>`
})
class ModuleComponent {

	spinner: I.ISpinner;
	spinnerSubscription: Subscription;

	constructor(private ngRedux: NgRedux<I.IAppState>, private zone:NgZone) {
		this.ngRedux.provideStore(appStore);
		this.spinnerSubscription = this.ngRedux.select<I.ISpinner>(['app','spinner']).subscribe((val) => {
			this.zone.run(() => {
				this.spinner = val;
			});
		});
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


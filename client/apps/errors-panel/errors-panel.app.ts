import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { NgModule, NgZone } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Component } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { IAppState } from './../../../common/interfaces';

import { NgReduxModule, NgRedux } from '@angular-redux/store';
import { select } from '@angular-redux/store';

import { appStore } from './../../services/store.service'

/* APP COMPONENT */
@Component({
	selector: 'errors-panel',
	template: `
		<h1>Errors Panel</h1>
	`
})
class AppComponent {

	errors: string[];
	errorsSubscription: Subscription;

	constructor(private ngRedux: NgRedux<IAppState>, private zone:NgZone) {
		this.ngRedux.provideStore(appStore);
		this.errorsSubscription = this.ngRedux.select<string[]>('errors').subscribe((c) => {
			this.zone.run(() => {
				console.log(c);
				this.errors = c;
			});
		})

	}

	clearErrors() {

	}

	ngOnDestroy() {
		this.errorsSubscription.unsubscribe();
	}

}

/* APP MODULE */
@NgModule({
	imports: [
		BrowserModule,
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


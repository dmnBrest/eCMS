import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { NgModule, NgZone } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Component } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { IAppState } from './../../../server/interfaces';

import { NgReduxModule, NgRedux } from '@angular-redux/store';
import { select } from '@angular-redux/store';

import * as StoreService from './../../services/store.service'

/* APP COMPONENT */
@Component({
	selector: 'messages-panel',
	styles: [
		'.c-error {padding: 10px 20px; background-color: #e44d49; color: #fff; font-size: 14px; margin-bottom: 2px;}',
		'.c-info {padding: 10px 20px; background-color: green; color: #fff; font-size: 14px; margin-bottom: 2px;}',
		'.c-notifications-component table {width: 100%;}',
		'.c-close-notification {text-align: right;}',
		'.c-close-notification a {color: #fff;}',
	],
	template: `
		<div class="c-notifications-component">
			<div *ngFor="let m of errors; let i = index" class="c-error">
				<table>
					<tr>
						<td>{{m}}</td>
						<td class="c-close-notification">
							<a href="javascript:void(0);"
								(click)="removeError(i)"
								uk-icon="icon: close;"></a>
						</td>
					</tr>
				</table>
			</div>
			<div *ngFor="let m of info; let i = index" class="c-info">
				<table>
					<tr>
						<td>{{m}}</td>
						<td class="c-close-notification">
							<a href="javascript:void(0);"
								(click)="removeInfo(i)"
								uk-icon="icon: close;"></a>
						</td>
					</tr>
				</table>
			</div>
		</div>
	`
})
class AppComponent {

	errors: string[];
	errorsSubscription: Subscription;
	info: string[];
	infoSubscription: Subscription;

	constructor(private ngRedux: NgRedux<IAppState>, private zone:NgZone) {
		this.ngRedux.provideStore(StoreService.appStore);
		this.errorsSubscription = this.ngRedux.select<string[]>('errors').subscribe((val) => {
			this.zone.run(() => {
				this.errors = val;
			});
		});
		this.errorsSubscription = this.ngRedux.select<string[]>('info').subscribe((val) => {
			this.zone.run(() => {
				this.info = val;
			});
		});
	}

	removeError(index:number) {
		StoreService.removeError(index);
	}

	removeInfo(index:number) {
		StoreService.removeInfo(index);
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


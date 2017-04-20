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

import { appStore, removeError } from './../../services/store.service'

/* APP COMPONENT */
@Component({
	selector: 'errors-panel',
	styles: [
		'.c-notification {padding: 10px 20px; background-color: #e44d49; color: #fff; font-size: 14px; margin-bottom: 2px;}',
		'.c-notifications-component table {width: 100%;}',
		'.c-close-notification {text-align: right;}',
		'.c-close-notification a {color: #fff;}',
	],
	template: `
		<div class="c-notifications-component">
			<div *ngFor="let err of errors; let i = index" class="c-notification">
				<table>
					<tr>
						<td>{{err}}</td>
						<td class="c-close-notification">
							<a href="javascript:void(0);"
								(click)="removeErrorHandler(i)"
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

	constructor(private ngRedux: NgRedux<IAppState>, private zone:NgZone) {
		this.ngRedux.provideStore(appStore);
		this.errorsSubscription = this.ngRedux.select<string[]>('errors').subscribe((c) => {
			this.zone.run(() => {
				this.errors = c;
			});
		})

	}

	removeErrorHandler(index:number) {
		removeError(index);
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


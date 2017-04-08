import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { NgModule, NgZone } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { IAppState, INCREMENT, DECREMENT, RESET  } from './../../services/store.service';

import { NgReduxModule, NgRedux } from '@angular-redux/store';
import { select } from '@angular-redux/store';

/* APP COMPONENT */
@Component({
	selector: 'app-login',
	template: `
		<h1>X APP LOGIN X</h1>

		<div>
			<button (click)="increment()">Increment</button>
			<div>Current Count: {{ count$ }}</div>
			<button (click)="decrement()">Decrement</button>
		</div>

	`
})
class AppComponent {

	count$: number;

	constructor(private ngRedux: NgRedux<IAppState>, private zone:NgZone) {
		ngRedux.provideStore((window as any).appStore);
		ngRedux.select<number>('count').subscribe((c) => {
			this.zone.run(() => {
				console.log(c);
				this.count$ = c;
			});
		})
	}

	increment(){
		this.ngRedux.dispatch({ type: INCREMENT });
	}
	decrement(){
		this.ngRedux.dispatch({ type: DECREMENT });
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


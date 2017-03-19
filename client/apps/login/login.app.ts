import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';

import { StoreService } from './../../services/store.service';

/* APP COMPONENT */
@Component({
	selector: 'app-login',
	template: `
		<h1>X APP LOGIN X</h1>
		<button (click)="clickMe()">CLICK !</button>
	`
})
class AppComponent {

	constructor(private storeService:StoreService) { }

	clickMe(): void {
		console.log('D1', this.storeService.st);
		this.storeService.doSomething().then((s) => {console.log('D2: ', s)});
	}
}

/* APP MODULE */
@NgModule({
	imports: [
		BrowserModule,
		FormsModule
	],
	declarations: [
		AppComponent
	],
	providers: [
		{provide: StoreService, useValue: (window as any).storeService}
	],
	bootstrap: [ AppComponent ]
})
class AppModule { }


/* APP BOOTSTRAP */
platformBrowserDynamic().bootstrapModule(
	AppModule
);


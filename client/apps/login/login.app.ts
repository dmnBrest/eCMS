import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';

import { SharedService } from './../../services/shared.service';

/* APP COMPONENT */
@Component({
	selector: 'app-login',
	template: `
		<h1>X APP LOGIN X</h1>
		<button (click)="clickMe()">CLICK !</button>
	`
})
class AppComponent {

	constructor(private sharedService:SharedService) { }

	clickMe(): void {
		console.log('D1', this.sharedService.st);
		this.sharedService.doSomething().then((s) => {console.log('D2: ', s)});
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
		{provide: SharedService, useValue: (window as any).sharedService}
	],
	bootstrap: [ AppComponent ]
})
class AppModule { }


/* APP BOOTSTRAP */
platformBrowserDynamic().bootstrapModule(
	AppModule
);


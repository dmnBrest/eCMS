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
	`
})
class AppComponent {
	
}

/* APP MODULE */
@NgModule({
	imports: [
		BrowserModule,
		FormsModule
	],
	declarations: [

	],
	providers: [
		SharedService
	],
	bootstrap: [ AppComponent ]
})
class AppModule { }


/* APP BOOTSTRAP */
platformBrowserDynamic().bootstrapModule(
	AppModule, 
	{ providers: [{provide: SharedService, useValue: (window as any).sharedService}] }
);


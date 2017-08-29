import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Component, NgModule, NgZone, OnInit, OnDestroy } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { StoreModule, provideStore } from '@ngrx/store';
import { NgReduxModule, NgRedux } from '@angular-redux/store';

import * as jQuery from 'jquery';

import { appStore } from './../../services/store.service';
import * as StoreService from './../../services/app.service';

import * as I from './../../../server/interfaces';

import { FileUploadModule, FileUploader } from "ng2-file-upload";

const URL = '/gallery/upload';

/* MODULE COMPONENT */
@Component({
	selector: 'gallery-module',
	templateUrl: './gallery.module.html'
})
class ModuleComponent implements OnInit, OnDestroy {

	show: boolean = false;
	mode: string = 'list'; // list, upload
	search: string;

	uploader:FileUploader = new FileUploader({
		url: URL,
		headers: [{name: 'csrf-token', value: (window as any).csrfToken}]
	});

	constructor(private ngRedux: NgRedux<I.IAppState>,  private zone:NgZone) {
		this.ngRedux.provideStore(appStore);

	}

	openGallery() {
		this.zone.run(() => {
			this.show = true;
			this.getImages();
		});
	}

	closeGallery() {
		this.show = false;
	}

	showListView() {
		this.mode = 'list';
	}

	showUploadView() {
		this.mode = 'upload';
	}

	getImages() {
		console.log('GalleryComponent');
		StoreService.getImages(this.search).then((images) => {
			console.log('FDFDFD:', images);
		});
	}

	ngOnInit() {
		StoreService.initGallery(this);
	}

	ngOnDestroy() {

	}

}

/* MODULE */
@NgModule({
	imports: [
		BrowserModule,
		NgReduxModule,
		FileUploadModule
	],
	declarations: [
		ModuleComponent
	],
	providers: [

	],
	bootstrap: [ ModuleComponent ]
})
class MainModule { }

/* BOOTSTRAP */
platformBrowserDynamic().bootstrapModule(MainModule);
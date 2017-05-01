import { Component, OnInit, OnDestroy, Renderer, ElementRef, ViewChild, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { IAppState } from './../../../server/interfaces';
import { NgRedux, select } from '@angular-redux/store';
import * as StoreService from './../../services/store.service'

declare const Spinner: any;

@Component({
	selector: 'spinner-component',
	template: `<div [hidden]="!spinner.show" class="c-spinner">
			<div class="c-spinner-overlay"></div>
			<div #spinnerWrapper class="c-spinner-wrapper"></div>
		</div>`,
	styles: [
		'.c-spinner-overlay {position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: #fff; opacity: 0.5; z-index: 99998;}',
		'.c-spinner-wrapper {position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 99999;}'
	]
})
export class SpinnerComponent implements OnInit, OnDestroy {

	@ViewChild('spinnerWrapper') spinnerEl:ElementRef;
	spinner: string[];
	spinnerSubscription: Subscription;

	constructor(private ngRedux: NgRedux<IAppState>, private zone:NgZone, private rd: Renderer) {
		this.ngRedux.provideStore(StoreService.appStore);
		this.spinnerSubscription = this.ngRedux.select<string[]>('spinner').subscribe((val) => {
			this.zone.run(() => {
				this.spinner = val;
			});
		});
	}

	ngOnInit() {

		// init Spin.js
		var opts = {
			lines: 11 // The number of lines to draw
			, length: 30 // The length of each line
			, width: 2 // The line thickness
			, radius: 36 // The radius of the inner circle
			, scale: 1.25 // Scales overall size of the spinner
			, corners: 1 // Corner roundness (0..1)
			, color: '#000' // #rgb or #rrggbb or array of colors
			, opacity: 0.25 // Opacity of the lines
			, rotate: 0 // The rotation offset
			, direction: 1 // 1: clockwise, -1: counterclockwise
			, speed: 1 // Rounds per second
			, trail: 55 // Afterglow percentage
			, fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
			, zIndex: 2e9 // The z-index (defaults to 2000000000)
			, className: 'spinner' // The CSS class to assign to the spinner
			, top: '50%' // Top position relative to parent
			, left: '50%' // Left position relative to parent
			, shadow: false // Whether to render a shadow
			, hwaccel: false // Whether to use hardware acceleration
			, position: 'absolute' // Element positioning
		}

		var spinner = new Spinner(opts).spin(this.spinnerEl.nativeElement);
	}

	ngOnDestroy() {
		this.spinnerSubscription.unsubscribe();
	}

}
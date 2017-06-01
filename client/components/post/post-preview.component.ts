import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import * as I from './../../../server/interfaces';

@Component({
	selector: 'c-post-preview',
	templateUrl: './post-preview.component.html'
})

export class PostPreviewComponent implements OnInit, OnDestroy, OnChanges {

	@Input() preview: I.IBBCodeRarserResponse;
	previewSafe: SafeHtml

	constructor(private sanitizer: DomSanitizer) {}

	ngOnChanges(changes: SimpleChanges) {
		if (changes.preview && changes.preview.currentValue) {
			console.log('GENERATE PREVIEW SAFE');
			this.previewSafe = this.sanitizer.bypassSecurityTrustHtml(changes.preview.currentValue.html);
		}
	}

	ngOnInit() {}

	ngOnDestroy() {}

}
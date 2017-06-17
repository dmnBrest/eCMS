import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, OnChanges, SimpleChanges, NgZone } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import * as I from './../../../server/interfaces';

@Component({
	selector: 'c-post-edit',
	templateUrl: './post-edit.component.html'
})

export class PostEditComponent implements OnInit, OnDestroy, OnChanges {

	@Input() post: I.IPost;
	@Input() preview: I.IBBCodeRarserResponse;
	previewSafe: SafeHtml
	@Input() user: I.IUser;
	@Output() savePostHandler:EventEmitter<I.IPost> = new EventEmitter();
	@Output() generatePreviewHandler:EventEmitter<I.IPost> = new EventEmitter();
	@Output() cancelEditingHandler:EventEmitter<null> = new EventEmitter();

	fields:I.IField[];

	constructor(private sanitizer: DomSanitizer,  private zone:NgZone) {}

	// previewSafe(): SafeHtml {
	// 	return this.sanitizer.bypassSecurityTrustHtml(this.preview.html);
	// }

	ngOnChanges(changes: SimpleChanges) {
		if (changes.user) {
			let user = changes.user.currentValue;
			if (user.is_writer) {
				this.fields = [
					{name: 'title', label: 'Title', type: I.FieldTypes.STRING, editable: true},
					{name: 'description', label: 'Description', type: I.FieldTypes.STRING, editable: true},
					{name: 'keywords', label: 'Keywords', type: I.FieldTypes.STRING, editable: true},
					{name: 'show_in_blog', label: 'Show in Blog', type: I.FieldTypes.BOOLEAN, editable: true},
				];
			} else {
				this.fields = [
					{name: 'title', label: 'Title', type: I.FieldTypes.STRING, editable: true}
				];
			}
		}
		if (changes.preview && changes.preview.currentValue) {
			console.log('GENERATE PREVIEW SAFE');
			this.previewSafe = this.sanitizer.bypassSecurityTrustHtml(changes.preview.currentValue.html);
		}
	}

	ngOnInit() {}

	savePost() {
		this.post.body_raw = jQuery('[markitupeditor="true"]').val();
		this.savePostHandler.emit(this.post);
	}

	generatePreview() {
		this.post.body_raw = jQuery('[markitupeditor="true"]').val();
		this.generatePreviewHandler.emit(this.post);
	}

	cancel() {
		this.cancelEditingHandler.emit();
	}

	ngOnDestroy() {}

}
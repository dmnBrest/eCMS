import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import * as I from './../../../server/interfaces';

@Component({
	selector: 'c-post-edit',
	templateUrl: './post-edit.component.html'
})

export class PostEditComponent implements OnInit, OnDestroy, OnChanges {

	@Input() post: I.IPost;
	@Input() user: I.IUser;
	@Output() savePostHandler:EventEmitter<I.IPost> = new EventEmitter();
	@Output() generatePreviewHandler:EventEmitter<I.IPost> = new EventEmitter();
	@Output() cancelEditingHandler:EventEmitter<null> = new EventEmitter();

	fields:I.IField[];

	constructor() {}

	ngOnChanges(changes: SimpleChanges) {
		if (changes.user) {
			let user = changes.user.currentValue;
			if (user.is_writer) {
				this.fields = [
					{name: 'title', label: 'Title', type: I.FieldTypes.STRING, editable: true},
					{name: 'description', label: 'Description', type: I.FieldTypes.STRING, editable: true},
					{name: 'keywords', label: 'Keywords', type: I.FieldTypes.STRING, editable: true}
				];
			} else {
				this.fields = [
					{name: 'title', label: 'Title', type: I.FieldTypes.STRING, editable: true}
				];
			}
		}
	}

	ngOnInit() {}

	savePost() {
		this.savePostHandler.emit(this.post);
	}

	generatePreview() {
		this.generatePreviewHandler.emit(this.post);
	}

	cancel() {
		this.cancelEditingHandler.emit();
	}

	ngOnDestroy() {}

}
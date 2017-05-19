import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import * as I from './../../../server/interfaces';

@Component({
	selector: 'c-post-edit',
	templateUrl: './post-edit.component.html'
})

export class PostEditComponent implements OnInit, OnDestroy {

	@Input() post: I.IPost;
	@Output() savePostHandler:EventEmitter<I.IPost> = new EventEmitter();
	@Output() cancelEditingHandler:EventEmitter<null> = new EventEmitter();

	fields:I.IField[] = [
		{name: 'title', label: 'Title', type: I.FieldTypes.STRING, editable: true}
	]

	constructor() {}

	ngOnInit() {}

	savePost() {
		this.savePostHandler.emit(this.post);
	}

	cancel() {
		this.cancelEditingHandler.emit();
	}

	ngOnDestroy() {}

}
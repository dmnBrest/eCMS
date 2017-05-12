import { Component, OnInit, OnDestroy, Input, SimpleChange, ContentChild, TemplateRef } from '@angular/core';
import * as I from './../../../server/interfaces';

@Component({
	selector: 'c-edit-view',
	templateUrl: './edit-view.component.html',
	styleUrls : ['./edit-view.component.css']
})

export class EditViewComponent implements OnInit, OnDestroy {

	@Input() object: any;
	@Input() objType: string;
	@Input() fields: I.IField[];

	FieldTypes = I.FieldTypes;

	//@ContentChild('actions') actionsTemplate: TemplateRef<any>;

	constructor() {}

	ngOnInit() {}

	ngOnDestroy() {}

}
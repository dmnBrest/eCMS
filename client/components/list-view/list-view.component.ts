import { Component, OnInit, OnDestroy, Input, SimpleChange, ContentChild, TemplateRef } from '@angular/core';
import * as I from './../../../server/interfaces';

@Component({
	selector: 'c-list-view',
	templateUrl: './list-view.component.html',
	styleUrls : ['./list-view.component.css']
})

export class ListViewComponent implements OnInit, OnDestroy {

	@Input() list: any[];
	@Input() columns: I.IField[];
	totalPages: number;
	FieldTypes = I.FieldTypes;

	@ContentChild('actions') actionsTemplate: TemplateRef<any>;

	constructor() {}

	ngOnInit() {}

	ngOnDestroy() {}

}
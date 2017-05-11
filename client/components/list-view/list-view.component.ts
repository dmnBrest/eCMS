import { Component, OnInit, OnDestroy, Input, SimpleChange, ContentChild, TemplateRef } from '@angular/core';
import { IColumn, ColumnTypes } from './../../../server/interfaces';

@Component({
	selector: 'c-list-view',
	templateUrl: './list-view.component.html',
	styleUrls : ['./list-view.component.css']
})

export class ListViewComponent implements OnInit, OnDestroy {

	@Input() list: any[];
	@Input() columns: IColumn[];
	totalPages: number;

	@ContentChild('actions') actionsTemplate: TemplateRef<any>;

	constructor() {}

	ngOnInit() {}

	ngOnDestroy() {}

}
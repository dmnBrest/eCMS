import { Component, OnInit, OnDestroy, Input } from '@angular/core';

@Component({
	selector: 'c-list-view',
	templateUrl: './list-view.component.html'
})

export class ListViewComponent implements OnInit, OnDestroy {

	@Input() list: any[];
	@Input() page: number;
	@Input() perPage: number;
	@Input() total: number;
	@Input() columns: string[];

	constructor() {}

	ngOnInit() {}

	ngOnDestroy() {}

}
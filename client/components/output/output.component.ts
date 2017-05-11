import { Component, OnInit, OnDestroy, Input, SimpleChange } from '@angular/core';
import { IColumn, ColumnTypes } from './../../../server/interfaces';
import * as moment from 'moment';

@Component({
	selector: 'c-output',
	template: '{{value}}',
})

export class OutputComponent implements OnInit, OnDestroy {

	@Input() type: ColumnTypes;

	private _value = '';
	@Input()
	set value(value: any) {
		if (this.type == ColumnTypes.DATE) {
			if (!value) {
				this._value = '';
			}
			let m = moment(value*1000);
			if (m.isValid()) {
				this._value = m.format('LL');
			} else {
				this._value = '';
			}
		} else {
			this._value = value;
		}
	}
	get value(): any { return this._value; }

	constructor() {}

	ngOnInit() {}

	ngOnDestroy() {}

}
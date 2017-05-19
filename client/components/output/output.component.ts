import { Component, OnInit, OnDestroy, Input, SimpleChange } from '@angular/core';
import * as I from './../../../server/interfaces';
import * as moment from 'moment';

@Component({
	selector: 'c-output',
	template: `<ng-container  [ngSwitch]="type">
	<ng-container *ngSwitchCase="FieldTypes.BOOLEAN">
		<span *ngIf="value == true">
			<svg aria-hidden="true" class="slds-icon slds-icon-text-default c-slds-icon--xsmall">
				<use xlink:href="/slds/icons/utility-sprite/svg/symbols.svg#check" xmlns:xlink="http://www.w3.org/1999/xlink"></use>
			</svg>
		</span>
	</ng-container>
	<ng-container *ngSwitchDefault>{{value}}</ng-container>
</ng-container >`
})

export class OutputComponent implements OnInit, OnDestroy {

	@Input() type: I.FieldTypes;
	FieldTypes = I.FieldTypes;

	private _value = '';
	@Input()
	set value(value: any) {
		if (this.type == I.FieldTypes.DATE) {
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
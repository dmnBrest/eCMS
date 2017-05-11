import { Component, OnInit, OnDestroy,  NgZone } from '@angular/core';
import * as StoreService from './../../services/app.service';

import { IAppState } from './../../../server/interfaces';

@Component({
	selector: 'c-personal-info',
	templateUrl: './personal-info.component.html'
})

export class PersonalInfoComponent implements OnInit, OnDestroy {

	constructor() {}

	ngOnInit() {}

	ngOnDestroy() {}

	getDashboarData() {
		// TODO ...
	}

}
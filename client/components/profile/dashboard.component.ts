import { Component, OnInit, OnDestroy,  NgZone } from '@angular/core';
import * as StoreService from './../../services/store.service';

import { IAppState } from './../../../server/interfaces';

@Component({
	selector: 'c-dashboard',
	templateUrl: './dashboard.component.html'
})

export class DashboardComponent implements OnInit, OnDestroy {

	constructor() {}

	ngOnInit() {}

	ngOnDestroy() {}

	getDashboarData() {
		// TODO ...
	}

}
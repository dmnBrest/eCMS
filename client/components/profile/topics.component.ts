import { Component, OnInit, OnDestroy,  NgZone } from '@angular/core';
import * as StoreService from './../../services/store.service';

import { IAppState } from './../../../server/interfaces';

@Component({
	selector: 'c-topics',
	templateUrl: './topics.component.html'
})

export class TopicsComponent implements OnInit, OnDestroy {

	constructor() {}

	ngOnInit() {}

	ngOnDestroy() {}

	getDashboarData() {
		// TODO ...
	}

}
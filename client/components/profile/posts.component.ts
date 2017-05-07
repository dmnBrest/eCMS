import { Component, OnInit, OnDestroy,  NgZone } from '@angular/core';
import * as StoreService from './../../services/store.service';

import { IAppState } from './../../../server/interfaces';

@Component({
	selector: 'c-posts',
	templateUrl: './posts.component.html'
})

export class PostsComponent implements OnInit, OnDestroy {

	constructor() {}

	ngOnInit() {}

	ngOnDestroy() {}

	getDashboarData() {
		// TODO ...
	}

}
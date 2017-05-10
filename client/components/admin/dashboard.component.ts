import { Component, OnInit, OnDestroy,  NgZone } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import * as StoreService from './../../services/store.service';
import { IAppState, IUser } from './../../../server/interfaces';

@Component({
	selector: 'c-dashboard',
	templateUrl: './dashboard.component.html'
})

export class DashboardComponent implements OnInit, OnDestroy {

	constructor(private ngRedux: NgRedux<IAppState>, private zone:NgZone) {

	}
	ngOnInit() {}

	ngOnDestroy() {

	}

	getDashboarData() {
		// TODO ...
	}

}
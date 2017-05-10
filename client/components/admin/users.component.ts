import { Component, OnInit, OnDestroy,  NgZone } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import * as StoreService from './../../services/store.service';
import { IAppState, IUser } from './../../../server/interfaces';

@Component({
	selector: 'c-users',
	templateUrl: './users.component.html'
})

export class UsersComponent implements OnInit, OnDestroy {

	users:any[]; // IUser
	page:number;
	usersPerPage:number;
	totalUsers:number;
	columns:string[] = ['id', 'username', 'email']

	constructor(private ngRedux: NgRedux<IAppState>, private zone:NgZone) {
		this.users = [
			{id: 1, username: 'Doom1', email: 'test1@test.com'},
			{id: 2, username: 'Doom2', email: 'test2@test.com'},
			{id: 3, username: 'Doom3', email: 'test3@test.com'}
		];
		this.page = 1;
		this.usersPerPage = 30;
		this.totalUsers = 120;
	}
	ngOnInit() {}

	ngOnDestroy() {

	}

	getDashboarData() {
		// TODO ...
	}

}
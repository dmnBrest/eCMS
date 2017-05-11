import { Component, OnInit, OnDestroy,  NgZone } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import * as AdminStoreService from './../../services/admin-store.service';
import { IAppState, IUser, IColumn, ColumnTypes } from './../../../server/interfaces';

@Component({
	selector: 'c-users',
	templateUrl: './users.component.html'
})

export class UsersComponent implements OnInit, OnDestroy {

	users:any[]; // IUser
	page:number;
	usersPerPage:number;
	totalPages: number;
	totalUsers:number;
	columns:IColumn[] = [
		{name: 'id', label: 'Id', type: ColumnTypes.STRING},
		{name: 'username', label: 'Username', type: ColumnTypes.STRING},
		{name: 'email', label: 'Email', type: ColumnTypes.STRING},
		{name: 'created_at', label: 'Created Date', type: ColumnTypes.DATE},
	]

	constructor(private ngRedux: NgRedux<IAppState>, private zone:NgZone) {
		this.users = null;
		this.page = 1;
		this.usersPerPage = 2;
		this.totalUsers = 0;
	}
	ngOnInit() {
		this.getUsers();
	}

	getUsers() {
		AdminStoreService.getUsers(this.page, this.usersPerPage)
		.then((resp:any) => {
			console.log('getUsersForAdmin');
			console.log(resp);
			this.users = resp.users;
			this.totalUsers = resp.totalUsers;
			this.totalPages = Math.ceil(this.totalUsers / this.usersPerPage);
		})
		.catch((err) => {
			console.log('Get Users ERROR')
		})
	}

	editUser(user:IUser) {
		console.log(user);
	}

	prevPage() {
		if (this.page < 1) {
			return;
		}
		this.page--;
		this.getUsers();
	}

	nextPage() {
		if (this.page >= this.totalPages) {
			return;
		}
		this.page++;
		this.getUsers();
	}

	ngOnDestroy() {

	}

	getDashboarData() {
		// TODO ...
	}

}
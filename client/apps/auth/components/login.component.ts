import { Component, OnInit, OnDestroy,  NgZone } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { loginFormSubmit } from './../../../services/store.service';
import { NgRedux, select } from '@angular-redux/store';

import { ILoginForm, IAppState } from './../../../../common/interfaces';

@Component({
	selector: 'c-login',
	templateUrl: './login.component.html'
})

export class LoginComponent implements OnInit, OnDestroy {

	loginFormData:ILoginForm = {
		email: null,
		password: null
	};

	constructor(private ngRedux: NgRedux<IAppState>, private zone:NgZone) {
		console.log('login.component constructor');
	}

	ngOnInit(): void {

	}

	ngOnDestroy() {

	}

	login() {
		console.log('click login()');
		loginFormSubmit(this.loginFormData).then((results: any) => {
			console.log('login component', results);
			if (results.status == 'ok') {
				window.location.href = '/';
			}
		}).catch(err => {
			console.log(err);
		});
	}

	// increment(){
	// 	this.ngRedux.dispatch({ type: INCREMENT });
	// }

	// decrement(){
	// 	this.ngRedux.dispatch({ type: DECREMENT });
	// }

}
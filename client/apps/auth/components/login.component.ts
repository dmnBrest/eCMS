import { Component, OnInit, OnDestroy,  NgZone } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { IAppState, authLoginRemoteCall } from './../../../services/store.service';
import { NgRedux, select } from '@angular-redux/store';


@Component({
	selector: 'c-login',
	templateUrl: './login.component.html'
})

export class LoginComponent implements OnInit, OnDestroy {

	constructor(private ngRedux: NgRedux<IAppState>, private zone:NgZone) {
		console.log('login.component constructor');
	}

	ngOnInit(): void {

	}

	ngOnDestroy() {

	}

	form = {
		email: 'test@test.com',
		password: 'doomdoom1'
	}

	login() {
		console.log('click login()');
		authLoginRemoteCall(this.form);
	}

	// increment(){
	// 	this.ngRedux.dispatch({ type: INCREMENT });
	// }

	// decrement(){
	// 	this.ngRedux.dispatch({ type: DECREMENT });
	// }

}
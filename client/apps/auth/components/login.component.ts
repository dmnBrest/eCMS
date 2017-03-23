import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { StoreService, IAppState, INCREMENT, DECREMENT } from './../../../services/store.service';
import { NgRedux } from '@angular-redux/store';
import { Store } from '@ngrx/store';
import { select } from '@angular-redux/store';


@Component({
	selector: 'c-login',
	templateUrl: './login.component.html'
})

export class LoginComponent implements OnInit {

	count$: Observable<number>;

	constructor(/*private storeService:StoreService,*/ private ngRedux: NgRedux<IAppState>) {
		ngRedux.provideStore((window as any).store2);
		this.count$ = ngRedux.select<number>('count');
	}

	ngOnInit(): void {
		// console.log('D1', this.storeService.st);
		// this.storeService.doSomething().then((s) => {console.log('D2: ', s)});
	}

	increment(){
		this.ngRedux.dispatch({ type: INCREMENT });
	}

	decrement(){
		this.ngRedux.dispatch({ type: DECREMENT });
	}

}
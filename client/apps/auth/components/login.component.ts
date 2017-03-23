import { Component, OnInit, OnDestroy,  NgZone } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { StoreService, IAppState, INCREMENT, DECREMENT } from './../../../services/store.service';
import { NgRedux, select } from '@angular-redux/store';


@Component({
	selector: 'c-login',
	templateUrl: './login.component.html'
})

export class LoginComponent implements OnInit, OnDestroy {

	counter: Number;
	counterSubscription: Subscription;

	constructor(private ngRedux: NgRedux<IAppState>, private zone:NgZone) {
		console.log('login.component constructor');

		this.counterSubscription = this.ngRedux.select<number>('count').subscribe((c) => {
			this.zone.run(() => {
				console.log(c);
				this.counter = c;
			});
		})
	}

	ngOnInit(): void {
		console.log('login.component init');

		this.increment();

		// console.log('D1', this.storeService.st);
		// this.storeService.doSomething().then((s) => {console.log('D2: ', s)});
	}


	ngOnDestroy() {
		console.log('login.component destroy');		
		this.counterSubscription.unsubscribe();
	} 

	increment(){
		this.ngRedux.dispatch({ type: INCREMENT });
	}

	decrement(){
		this.ngRedux.dispatch({ type: DECREMENT });
	}

}
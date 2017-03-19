//import { Injectable } from '@angular/core';
import { ActionReducer, Action } from '@ngrx/store';

export const INCREMENT = 'INCREMENT';
export const DECREMENT = 'DECREMENT';
export const RESET = 'RESET';

//@Injectable()
export class StoreService {
	
	counter: number = 0;
	
	doSomething(): Promise<String> {
		this.counter++;
		console.log('D1: doSomething: ', this.counter);
		return Promise.resolve('BOOM!');
	}
	st: string = 'ZOOM!';

	// counterReducer(state: number = 0, action: Action): number {
	// 	switch (action.type) {
	// 		case INCREMENT:
	// 			return state + 1;

	// 		case DECREMENT:
	// 			return state - 1;

	// 		case RESET:
	// 			return 0;

	// 		default:
	// 			return state;
	// 	}
	// }


}

(window as any).storeService = new StoreService();


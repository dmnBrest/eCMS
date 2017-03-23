import { Injectable } from '@angular/core';
import { Action } from 'redux';
//import { ActionReducer, Action, provideStore, StoreModule } from '@ngrx/store';

import { applyMiddleware, Store, combineReducers, compose, createStore } from 'redux';
import { NgReduxModule, NgRedux } from '@angular-redux/store';

export const INCREMENT = 'INCREMENT';
export const DECREMENT = 'DECREMENT';
export const RESET = 'RESET';

export interface IAppState {
	count: number;
};

export const INITIAL_STATE: IAppState = {
  count: 0,
};

export function rootReducer(lastState: IAppState, action: Action): IAppState {
	switch(action.type) {
		case INCREMENT: return { count: lastState.count + 1 };
		case DECREMENT: return { count: lastState.count - 1 };
	}

	// We don't care about any other actions right now.
	return lastState;
}

export const store: Store<IAppState> = createStore(
  rootReducer, INITIAL_STATE);

(window as any).store2 = store;
console.log((window as any).store2);


// ----------------------
@Injectable()
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

// export const counterReducer: ActionReducer<number> = (state: number = 0, action: Action) => {
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

//(window as any).counterStoreProvider = StoreModule.provideStore({ counter: counterReducer });
//console.log((window as any).counterStoreProvider);

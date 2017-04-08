import { Injectable } from '@angular/core';
import { Action, applyMiddleware, Store, combineReducers, compose, createStore } from 'redux';

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
	return lastState;
}

export const store: Store<IAppState> = createStore(rootReducer, INITIAL_STATE);
(window as any).appStore = store;



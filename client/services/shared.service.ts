import { Injectable } from '@angular/core';

@Injectable()
export class SharedService {
	
	counter: number = 0;
	
	doSomething(): Promise<String> {
		this.counter++;
		console.log('D1: doSomething: ', this.counter);
		return Promise.resolve('BOOM!');
	}
	st: string = 'ZOOM!';
}

(window as any).sharedService = new SharedService();

console.log('Init Shared Service');
console.log((window as any).sharedService);

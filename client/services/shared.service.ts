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


// export class SharedService {
//   showModal:Subject = new Subject();
// }
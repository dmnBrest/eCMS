import { Component, OnInit } from '@angular/core';
import { StoreService } from './../../../services/store.service';

@Component({
	selector: 'c-login',
	templateUrl: './login.component.html'
})

export class LoginComponent implements OnInit {

	constructor(private storeService:StoreService) { }

	ngOnInit(): void {
		console.log('D1', this.storeService.st);
		this.storeService.doSomething().then((s) => {console.log('D2: ', s)});
	}

}
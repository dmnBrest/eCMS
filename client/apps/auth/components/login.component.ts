import { Component, OnInit } from '@angular/core';
import { SharedService } from './../../../services/shared.service';

@Component({
	selector: 'c-login',
	templateUrl: './login.component.html'
})

export class LoginComponent implements OnInit {

	constructor(private sharedService:SharedService) { }

	ngOnInit(): void {
		console.log('D1', this.sharedService.st);
		this.sharedService.doSomething().then((s) => {console.log('D2: ', s)});
	}

}
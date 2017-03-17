import { Component } from '@angular/core';

@Component({
	selector: 'c-auth',
	template: `
		<a routerLink="/login" routerLinkActive="active-link">Login</a>
		<a routerLink="/register" routerLinkActive="active-link">Register</a>
		<router-outlet></router-outlet>
	`
})
export class AuthComponent {
	title = 'Auth App ...';
}

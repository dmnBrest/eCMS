import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './components/login.component';
import { RegisterComponent } from './components/register.component';
import { SharedService } from './../../services/shared.service'


import { AuthComponent } from './auth.component';

const routes: Routes = [
	{ path: 'login', component: LoginComponent },
	{ path: 'register', component: RegisterComponent },
	{ path: '', redirectTo: '/login', pathMatch: 'full' },
];


@NgModule({
	imports: [
		BrowserModule,
		FormsModule,
		HttpModule,
		RouterModule.forRoot(routes, { useHash: true })
	],
	declarations: [
		AuthComponent,
		LoginComponent,
		RegisterComponent
	],
	providers: [
		SharedService
	],
	bootstrap: [ AuthComponent ]
})

export class AuthModule { }
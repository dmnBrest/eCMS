import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Component, NgModule, NgZone, OnInit, OnDestroy } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import * as jQuery from 'jquery';

import { StoreModule, provideStore } from '@ngrx/store';
import { NgReduxModule, NgRedux } from '@angular-redux/store';

import { DashboardComponent } from './../../components/admin/dashboard.component';
import { UsersComponent } from './../../components/admin/users.component';
import { TopicsComponent } from './../../components/admin/topics.component';
import { TopicEditComponent } from './../../components/admin/topic-edit.component';
import { ListViewComponent } from './../../components/list-view/list-view.component';
import { EditViewComponent } from './../../components/edit-view/edit-view.component';
import { OutputComponent } from './../../components/output/output.component';

import { KeysPipe } from './../../pipes/keys.pipe';

import * as AdminStoreService from './../../services/admin.service';

import * as I from './../../../server/interfaces';

import { appStore } from './../../services/store.service';

/* MODULE COMPONENT */
@Component({
	selector: 'admin-module',
	templateUrl: './admin.module.html',
	styleUrls: ['./admin.module.css']
})
class ModuleComponent implements OnInit, OnDestroy {

	route: string;
	mode: string;
	routeSubscription: Subscription;

	constructor(private ngRedux: NgRedux<I.IAppState>,  private zone:NgZone) {
		this.ngRedux.provideStore(appStore);

		// ROUTING
		this.routeSubscription = this.ngRedux.select<string>(['app', 'hash']).subscribe((val) => {
			this.zone.run(() => {
				this.route = val;
				let r1 = /#\/topic\/([a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12})/;
				if (this.route == '#/dashboard') {
					this.mode = 'dashboard';
				} else if (this.route == '#/users') {
					this.mode = 'users';
				} else if (this.route == '#/topics') {
					this.mode = 'topics';
				} else if (this.route == '#/topic/new') {
					AdminStoreService.newSelectedTopic();
					this.mode = 'topicEdit';
				} else if (this.route.match(r1)) {
					let m = this.route.match(r1);
					AdminStoreService.selectedTopic(m[1]);
					this.mode = 'topicEdit';
				} else {
					this.mode = null;
					location.hash = '#/dashboard';
				}

			});
		});
	}

	ngOnInit() {}

	ngOnDestroy() {}

}


/* MODULE */
@NgModule({
	imports: [
		BrowserModule,
		FormsModule,
		NgReduxModule
	],
	declarations: [
		ModuleComponent,
		DashboardComponent,
		UsersComponent,
		TopicsComponent,
		ListViewComponent,
		EditViewComponent,
		TopicEditComponent,
		OutputComponent,
		KeysPipe
	],
	providers: [

	],
	bootstrap: [ ModuleComponent ]
})
class MainModule { }

/* BOOTSTRAP */
platformBrowserDynamic().bootstrapModule(MainModule);

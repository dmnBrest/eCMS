import { Component, OnInit, OnDestroy,  NgZone } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import * as AdminStoreService from './../../services/admin.service';
import { IAppState, IUser, IColumn, ITopic, ColumnTypes } from './../../../server/interfaces';

@Component({
	selector: 'c-topics',
	templateUrl: './topics.component.html'
})

export class TopicsComponent implements OnInit, OnDestroy {

	state: any;
	stateSubscription: Subscription;

	columns:IColumn[] = [
		{name: 'id', label: 'Id', type: ColumnTypes.STRING},
		{name: 'title', label: 'Title', type: ColumnTypes.STRING},
		{name: 'order', label: 'Order', type: ColumnTypes.NUMBER},
		{name: 'total_posts', label: 'Order', type: ColumnTypes.NUMBER}
	]

	constructor(private ngRedux: NgRedux<IAppState>, private zone:NgZone) {
		// STATE SUBSCRIPTION
		this.stateSubscription = this.ngRedux.select<any>(['admin', 'topics']).subscribe((val) => {
			this.zone.run(() => {
				this.state = val;
				console.log('state', this.state);
				if (!this.state) {
					this.getTopics();
				}
			});
		});

	}
	ngOnInit() {
		//this.getUsers();
	}

	getTopics() {
		AdminStoreService.getObjects('topics');
	}

	editTopic(topic:ITopic) {
		alert('Todo: editTopic');
	}

	addTopic() {
		AdminStoreService.getObjects('topics');
	}

	saveTopic() {
		AdminStoreService.getObjects('topics');
	}

	ngOnDestroy() {
		this.stateSubscription.unsubscribe();
	}


}
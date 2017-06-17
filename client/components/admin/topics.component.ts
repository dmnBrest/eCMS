import { Component, OnInit, OnDestroy,  NgZone } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import * as AdminStoreService from './../../services/admin.service';
import * as I from './../../../server/interfaces';

@Component({
	selector: 'c-topics',
	templateUrl: './topics.component.html'
})

export class TopicsComponent implements OnInit, OnDestroy {

	state: any;
	stateSubscription: Subscription;

	columns:I.IField[] = [
		{name: 'id', label: 'Id', type: I.FieldTypes.STRING},
		{name: 'title', label: 'Title', type: I.FieldTypes.STRING},
		{name: 'order', label: 'Order', type: I.FieldTypes.NUMBER},
		{name: 'total_posts', label: 'Total Posts', type: I.FieldTypes.NUMBER},
		{name: 'slug', label: 'Slug', type: I.FieldTypes.STRING},
		{name: 'type', label: 'Type', type: I.FieldTypes.STRING},
		{name: 'is_hidden', label: 'Is Hidden', type: I.FieldTypes.BOOLEAN}
	]

	constructor(private ngRedux: NgRedux<I.IAppState>, private zone:NgZone) {
		// STATE SUBSCRIPTION
		this.stateSubscription = this.ngRedux.select<any>(['admin', 'listViews', 'topic']).subscribe((val) => {
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
		AdminStoreService.getObjects('topic');
	}

	editTopic(topic:I.ITopic) {
		location.hash = '#/topic/'+topic.id;
	}

	prevPage() {
		AdminStoreService.prevPage('topic');
	}

	nextPage() {
		AdminStoreService.nextPage('topic');
	}

	addTopic() {
		location.hash = '#/topic/new';
	}

	ngOnDestroy() {
		this.stateSubscription.unsubscribe();
	}


}
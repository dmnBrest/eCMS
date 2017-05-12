import { Component, OnInit, OnDestroy,  NgZone } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import * as AdminStoreService from './../../services/admin.service';
import * as I from './../../../server/interfaces';

@Component({
	selector: 'c-topic-edit',
	templateUrl: './topic-edit.component.html'
})

export class TopicEditComponent implements OnInit, OnDestroy {

	topic: I.ITopic;
	topicSubscription: Subscription;

	fields:I.IField[] = [
		//{name: 'id', label: 'Id', type: I.FieldTypes.STRING, editable: false},
		{name: 'title', label: 'Title', type: I.FieldTypes.STRING, editable: true},
		{name: 'order', label: 'Order', type: I.FieldTypes.NUMBER, editable: true}
	]

	constructor(private ngRedux: NgRedux<I.IAppState>, private zone:NgZone) {
		// STATE SUBSCRIPTION
		this.topicSubscription = this.ngRedux.select<I.ITopic>(['admin', 'selectedTopic']).subscribe((val) => {
			this.zone.run(() => {
				this.topic = val;
			});
		});

	}
	ngOnInit() {
		//this.getUsers();
	}

	saveTopic() {
		AdminStoreService.saveTopic(this.topic);
	}

	cancel() {
		location.hash = '#/topics';
	}

	ngOnDestroy() {
		this.topicSubscription.unsubscribe();
	}

}
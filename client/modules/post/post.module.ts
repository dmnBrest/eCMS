import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Component, NgModule, NgZone, OnInit, OnDestroy } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import * as jQuery from 'jquery';

import { StoreModule, provideStore } from '@ngrx/store';
import { NgReduxModule, NgRedux } from '@angular-redux/store';

import { EditViewComponent } from './../../components/edit-view/edit-view.component';
import { PostEditComponent } from './../../components/post/post-edit.component';
import { MarkItUpEditorDirective } from './../../directives/markitup/markitup.directive';

import * as I from './../../../server/interfaces';

import { appStore } from './../../services/store.service';
import * as StoreService from './../../services/app.service';

/* MODULE COMPONENT */
@Component({
	selector: 'post-module',
	templateUrl: './post.module.html'
})
class ModuleComponent implements OnInit, OnDestroy {

	mode: string
	routeSubscription: Subscription;
	post: I.IPost;
	postSubscription: Subscription;
	topic: I.ITopic;
	topicSubscription: Subscription;
	user: I.IUser;
	userSubscription: Subscription;

	constructor(private ngRedux: NgRedux<I.IAppState>,  private zone:NgZone) {
		this.ngRedux.provideStore(appStore);
		this.topicSubscription = this.ngRedux.select<I.ITopic>(['app', 'selectedTopic']).subscribe((val) => {
			this.zone.run(() => {
				this.topic = val;
			});
		});
		this.postSubscription = this.ngRedux.select<I.IPost>(['app', 'selectedPost']).subscribe((val) => {
			this.zone.run(() => {
				this.post = val;
			});
		});
		this.userSubscription = this.ngRedux.select<I.IUser>(['app', 'currentUser']).subscribe((val) => {
			this.zone.run(() => {
				this.user = val;
			});
		});
		// ROUTING
		this.routeSubscription = this.ngRedux.select<string>(['app', 'hash']).subscribe((val) => {
			this.zone.run(() => {
				let editPostRegex = /#\/post-edit\/(\d+)/;
				if (val == '#/new-post') {
					this.mode = 'newPost';
					StoreService.initEmptyPost();
				} else if (val.match(editPostRegex)) {
					let m = val.match(editPostRegex);
					StoreService.getPost(+m[1]);
					this.mode = 'editPost';
				} else {
					this.mode = null;
				}

			});
		});
	}

	savePost(post:I.IPost) {
		StoreService.savePost(post);
	}

	generatePreview(post:I.IPost) {
		StoreService.generatePreview(post);
	}

	cancelEditing(event:any) {
		console.log(event);
		location.hash = '';
	}

	ngOnInit() {}

	ngOnDestroy() {
		this.postSubscription.unsubscribe();
		this.routeSubscription.unsubscribe();
		this.userSubscription.unsubscribe();
		this.topicSubscription.unsubscribe();
	}

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
		EditViewComponent,
		PostEditComponent,
		MarkItUpEditorDirective
	],
	providers: [

	],
	bootstrap: [ ModuleComponent ]
})
class MainModule { }

/* BOOTSTRAP */
platformBrowserDynamic().bootstrapModule(MainModule);

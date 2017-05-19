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

import * as I from './../../../server/interfaces';

import { appStore } from './../../services/store.service';

/* MODULE COMPONENT */
@Component({
	selector: 'post-module',
	templateUrl: './post.module.html'
})
class ModuleComponent implements OnInit, OnDestroy {

	post: I.IPost;
	postSubscription: Subscription;
	mode: string
	routeSubscription: Subscription;

	constructor(private ngRedux: NgRedux<I.IAppState>,  private zone:NgZone) {
		this.ngRedux.provideStore(appStore);
		this.postSubscription = this.ngRedux.select<I.IPost>(['app', 'selectedPost']).subscribe((val) => {
			this.zone.run(() => {
				//this.post = val;
				this.post = {
					id: 1,
					title: 'Test Post #1',
					body_raw: null,
					body_html: null,
					slug: null,
					total_posts: 0,
					description: null,
					keyword: null,
					created_at: null,
					updated_at: null,
					user_id: 1,
					post_id: null,
					topic_id: 1,
					image_ids: []
				}
			});
		});

		// ROUTING
		this.routeSubscription = this.ngRedux.select<string>(['app', 'hash']).subscribe((val) => {
			this.zone.run(() => {
				if (val == '#/new-post') {
					this.mode = 'newPost';
				} else if (val.match(/#\/post-(\d+)/)) {
					let m = val.match(/#\/post-(\d+)/);
					//AdminStoreService.selectedTopic(+m[1]);
					this.mode = 'editPost';
				} else {
					this.mode = null;
				}

			});
		});
	}

	savePost() {
		console.log('MODULE: SavePost();')
	}

	cancelEditing() {
		location.hash = '';
	}

	ngOnInit() {}

	ngOnDestroy() {
		this.postSubscription.unsubscribe();
		this.routeSubscription.unsubscribe();
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
		PostEditComponent
	],
	providers: [

	],
	bootstrap: [ ModuleComponent ]
})
class MainModule { }

/* BOOTSTRAP */
platformBrowserDynamic().bootstrapModule(MainModule);

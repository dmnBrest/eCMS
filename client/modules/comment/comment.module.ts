import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Component, NgModule, NgZone, OnInit, OnDestroy } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import * as jQuery from 'jquery';

import { StoreModule, provideStore } from '@ngrx/store';
import { NgReduxModule, NgRedux } from '@angular-redux/store';

import * as I from './../../../server/interfaces';

import { appStore } from './../../services/store.service';
import * as StoreService from './../../services/app.service';

declare let window:any;
declare const markitupSettings: any;

/* MODULE COMPONENT */
@Component({
	selector: 'comment-module',
	templateUrl: 'comment.module.html'
})
class ModuleComponent implements OnInit, OnDestroy {

	mode: string
	routeSubscription: Subscription;
	post: I.IPost;
	postSubscription: Subscription;
	user: I.IUser;
	userSubscription: Subscription;

	tmpl:string = `
<div class="c-comment-editor-wrapper">
	<textarea class="c-comment-editor"></textarea>
	<div>
		<button class="c-comment-save-btn slds-button slds-button--brand">Save</button>
		<button class="c-comment-cancel-btn slds-button slds-button--neutral">Cancel</button>
	</div>
</div>
	`;

	constructor(private ngRedux: NgRedux<I.IAppState>,  private zone:NgZone) {
		this.ngRedux.provideStore(appStore);
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
				let editPostRegex = /#\/edit-comment\/(\d+)/;
				if (val == '#/new-comment') {
					this.initNewCommentForm();
				} else if (val.match(editPostRegex)) {
					let m = val.match(editPostRegex);
					this.initCommentEditForm(m[1]);
				} else {
					this.clearCommentEditor();
				}

			});
		});
	}

	initNewCommentForm() {
		let pl = jQuery('.c-new-comment-placeholder');
		console.log('New Comment init');
		console.log(pl);
		pl.html(this.tmpl);
		pl.find('textarea').markItUp(markitupSettings);
		pl.find('.c-comment-cancel-btn').click(()=>{
			location.hash = '';
		});
		pl.find('.c-comment-save-btn').click(()=>{
			let commentRaw = pl.find('textarea').val();
			this.saveComment(commentRaw, null);
		});
		this.mode = 'new';
	}

	clearCommentEditor() {
		jQuery('.c-new-comment-placeholder').html('');
		jQuery('.c-comment-placeholder').html('');
		this.mode = null;
	}

	initCommentEditForm(commentId: string) {
		let pl = jQuery('.c-comment-placeholder[data-id="'+commentId+'"]');
		console.log('Comment init: ', commentId);
		console.log(pl);
		pl.html(this.tmpl);
		pl.find('textarea').markItUp(markitupSettings);
		pl.find('.c-comment-cancel-btn').click(()=>{
			location.hash = '';
		});
		pl.find('.c-comment-save-btn').click(()=>{
			let commentRaw = pl.find('textarea').val();
			let commentId = pl.data('id');
			this.saveComment(commentRaw, commentId);
		});
		this.mode = 'edit';
	}

	async saveComment(commentRaw:string, commentId:string) {
		console.log('commentRaw:', commentRaw);
		console.log('commentId:', commentId);
		console.log('postId:', this.post.id);
		let comment;
		try {
			comment = await StoreService.saveComment({id: commentId, body_raw: commentRaw, post_id: this.post.id} as I.IComment);
			if (comment == null) {
				throw 'Bad response';
			}
		} catch(err) {
			console.log(err);
		}
		console.log('COMMENT:');
		console.log(comment);
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
	}

}

/* MODULE */
@NgModule({
	imports: [
		BrowserModule,
		NgReduxModule
	],
	declarations: [
		ModuleComponent,
	],
	providers: [

	],
	bootstrap: [ ModuleComponent ]
})
class MainModule { }

/* BOOTSTRAP */
platformBrowserDynamic().bootstrapModule(MainModule);

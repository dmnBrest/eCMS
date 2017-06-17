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

				this.clearCommentEditor();

				let editPostRegex = /#\/edit-comment\/([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})/;
				if (val == '#/new-comment') {
					this.initNewCommentForm();
				} else if (val.match(editPostRegex)) {
					let m = val.match(editPostRegex);
					this.initCommentEditForm(m[1]);
				}

			});
		});
	}

	initNewCommentForm() {
		let pl = jQuery('.c-new-comment-placeholder');
		let initialBody = pl.text();
		pl.html(this.tmpl);
		pl.find('textarea').markItUp(markitupSettings).val(initialBody);
		pl.find('.c-comment-cancel-btn').click(()=>{
			this.cancelEditing();
		});
		pl.find('.c-comment-save-btn').click(()=>{
			let commentRaw = pl.find('textarea').val();
			this.saveComment(commentRaw, null);
		});
		this.mode = 'new';
	}

	clearCommentEditor() {
		jQuery('.c-new-comment-placeholder .c-comment-editor-wrapper').remove();
		jQuery('.c-comment-placeholder .c-comment-editor-wrapper').remove();
		this.mode = null;
	}

	initCommentEditForm(commentId: string) {
		let pl = jQuery('.c-comment-placeholder#comment-'+commentId);
		let initialBody = pl.text();
		console.log('X1');
		console.log(initialBody);
		pl.html(this.tmpl);
		pl.find('textarea').markItUp(markitupSettings).val(initialBody);
		pl.find('.c-comment-cancel-btn').click(()=>{
			this.cancelEditing();
		});
		pl.find('.c-comment-save-btn').click(()=>{
			let commentRaw = pl.find('textarea').val();
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

			console.log('D:', comment);

			if (comment == null) {
				throw 'Bad response';
			}
			let v = location.protocol+'//'+location.host+location.pathname;
			let d = new Date().getTime();
			location.href = v+'?'+d+'#'+comment.id;
		} catch(err) {
			console.log(err);
		}
	}

	cancelEditing() {
		location.hash = '#/';
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

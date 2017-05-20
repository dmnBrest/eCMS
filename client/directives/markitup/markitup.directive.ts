import { Directive, ElementRef, Input } from '@angular/core';

declare const mySettings: any;

@Directive({ selector: '[markItUpEditor]' })
export class MarkItUpEditorDirective {
	constructor(el: ElementRef) {
		jQuery(el.nativeElement).markItUp(mySettings);
	}
}
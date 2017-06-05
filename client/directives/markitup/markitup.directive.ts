import { Directive, ElementRef, Input } from '@angular/core';

declare const markitupSettings: any;

@Directive({ selector: '[markItUpEditor]' })
export class MarkItUpEditorDirective {
	constructor(el: ElementRef) {
		jQuery(el.nativeElement).markItUp(markitupSettings);
	}
}
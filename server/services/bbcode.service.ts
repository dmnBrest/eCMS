/*
	Extendible BBCode Parser v1.0.0
	By Patrick Gillespie (patorjk@gmail.com)
	Website: http://patorjk.com/

	This module allows you to parse BBCode and to extend to the mark-up language
	to add in your own tags.
*/

import * as I from './../interfaces';

class XBBCodes {
	urlPattern = /^(?:https?|file|c):(?:\/{1,3}|\\{1})[-a-zA-Z0-9:;,@#%&()~_?\+=\/\\\.]*$/;
	colorNamePattern = /^(?:aliceblue|antiquewhite|aqua|aquamarine|azure|beige|bisque|black|blanchedalmond|blue|blueviolet|brown|burlywood|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|cyan|darkblue|darkcyan|darkgoldenrod|darkgray|darkgreen|darkkhaki|darkmagenta|darkolivegreen|darkorange|darkorchid|darkred|darksalmon|darkseagreen|darkslateblue|darkslategray|darkturquoise|darkviolet|deeppink|deepskyblue|dimgray|dodgerblue|firebrick|floralwhite|forestgreen|fuchsia|gainsboro|ghostwhite|gold|goldenrod|gray|green|greenyellow|honeydew|hotpink|indianred|indigo|ivory|khaki|lavender|lavenderblush|lawngreen|lemonchiffon|lightblue|lightcoral|lightcyan|lightgoldenrodyellow|lightgray|lightgreen|lightpink|lightsalmon|lightseagreen|lightskyblue|lightslategray|lightsteelblue|lightyellow|lime|limegreen|linen|magenta|maroon|mediumaquamarine|mediumblue|mediumorchid|mediumpurple|mediumseagreen|mediumslateblue|mediumspringgreen|mediumturquoise|mediumvioletred|midnightblue|mintcream|mistyrose|moccasin|navajowhite|navy|oldlace|olive|olivedrab|orange|orangered|orchid|palegoldenrod|palegreen|paleturquoise|palevioletred|papayawhip|peachpuff|peru|pink|plum|powderblue|purple|red|rosybrown|royalblue|saddlebrown|salmon|sandybrown|seagreen|seashell|sienna|silver|skyblue|slateblue|slategray|snow|springgreen|steelblue|tan|teal|thistle|tomato|turquoise|violet|wheat|white|whitesmoke|yellow|yellowgreen)$/;
	colorCodePattern = /^#?[a-fA-F0-9]{6}$/;
	emailPattern = /[^\s@]+@[^\s@]+\.[^\s@]+/;
	fontFacePattern = /^([a-z][a-z0-9_]+|"[a-z][a-z0-9_\s]+")$/i;
	tagList:any;
	tagsNoParseList:any = [];
	bbRegExp:any;
	pbbRegExp:any;
	pbbRegExp2:any;
	openTags:any;
	closeTags:any;

	/* -----------------------------------------------------------------------------
	 * tags
	 * This object contains a list of tags that your code will be able to understand.
	 * Each tag object has the following properties:
	 *
	 *   openTag - A function that takes in the tag's parameters (if any) and its
	 *             contents, and returns what its HTML open tag should be.
	 *             Example: [color=red]test[/color] would take in "=red" as a
	 *             parameter input, and "test" as a content input.
	 *             It should be noted that any BBCode inside of "content" will have
	 *             been processed by the time it enter the openTag function.
	 *
	 *   closeTag - A function that takes in the tag's parameters (if any) and its
	 *              contents, and returns what its HTML close tag should be.
	 *
	 *   displayContent - Defaults to true. If false, the content for the tag will
	 *                    not be displayed. This is useful for tags like IMG where
	 *                    its contents are actually a parameter input.
	 *
	 *   restrictChildrenTo - A list of BBCode tags which are allowed to be nested
	 *                        within this BBCode tag. If this property is omitted,
	 *                        any BBCode tag may be nested within the tag.
	 *
	 *   restrictParentsTo - A list of BBCode tags which are allowed to be parents of
	 *                       this BBCode tag. If this property is omitted, any BBCode
	 *                       tag may be a parent of the tag.
	 *
	 *   noParse - true or false. If true, none of the content WITHIN this tag will be
	 *             parsed by the XBBCode parser.
	 *
	 *
	 *
	 * LIMITIONS on adding NEW TAGS:
	 *  - Tag names should be alphanumeric (including underscores) and all tags should have an opening tag
	 *    and a closing tag.
	 *    The [*] tag is an exception because it was already a standard
	 *    bbcode tag. Technecially tags don't *have* to be alphanumeric, but since
	 *    regular expressions are used to parse the text, if you use a non-alphanumeric
	 *    tag names, just make sure the tag name gets escaped properly (if needed).
	 * --------------------------------------------------------------------------- */

	tags = {
		"b": {
			openTag: (params:any, content:any) => {
				return '<b>';
			},
			closeTag: (params:any, content:any) => {
				return '</b>';
			}
		},
		/*
			This tag does nothing and is here mostly to be used as a classification for
			the bbcode input when evaluating parent-child tag relationships
		*/
		"bbcode": {
			openTag: (params:any, content:any) => {
				return '';
			},
			closeTag: (params:any, content:any) => {
				return '';
			}
		},
		"center": {
			openTag: (params:any, content:any) => {
				return '<span style="text-align: center;">';
			},
			closeTag: (params:any, content:any) => {
				return '</span>';
			}
		},

		"code": {
			openTag: (params:any, content:any) => {
				return '<pre class="xbbcode-code">';
			},
			closeTag: (params:any, content:any) => {
				return '</pre>';
			},
			noParse: true
		},
		"color": {
			openTag: (params:any, content:any) => {
				params = params || '';

				var colorCode = (params.substr(1)).toLowerCase() || "black";
				this.colorNamePattern.lastIndex = 0;
				this.colorCodePattern.lastIndex = 0;
				if ( !this.colorNamePattern.test( colorCode ) ) {
					if ( !this.colorCodePattern.test( colorCode ) ) {
						colorCode = "black";
					} else {
						if (colorCode.substr(0,1) !== "#") {
							colorCode = "#" + colorCode;
						}
					}
				}

				return '<span style="color:' + colorCode + '">';
			},
			closeTag: (params:any, content:any) => {
				return '</span>';
			}
		},
		"email": {
			openTag: (params:any, content:any) => {

				var myEmail;

				if (!params) {
					myEmail = content.replace(/<.*?>/g,"");
				} else {
					myEmail = params.substr(1);
				}

				this.emailPattern.lastIndex = 0;
				if ( !this.emailPattern.test( myEmail ) ) {
					return '<a>';
				}

				return '<a href="mailto:' + myEmail + '">';
			},
			closeTag: (params:any, content:any) => {
				return '</a>';
			}
		},
		"face": {
			openTag: (params:any, content:any) => {
				params = params || '';

				var faceCode = params.substr(1) || "inherit";
				this.fontFacePattern.lastIndex = 0;
				if ( !this.fontFacePattern.test( faceCode ) ) {
						faceCode = "inherit";
				}
				return '<span style="font-family:' + faceCode + '">';
			},
			closeTag: (params:any, content:any) => {
				return '</span>';
			}
		},


		"font": {
			openTag: (params:any, content:any) => {
				params = params || '';

				var faceCode = params.substr(1) || "inherit";
				this.fontFacePattern.lastIndex = 0;
				if ( !this.fontFacePattern.test( faceCode ) ) {
						faceCode = "inherit";
				}
				return '<span style="font-family:' + faceCode + '">';
			},
			closeTag: (params:any, content:any) => {
				return '</span>';
			}
		},

		"i": {
			openTag: (params:any, content:any) => {
				return '<i>';
			},
			closeTag: (params:any, content:any) => {
				return '</i>';
			}
		},
		"img": {
			openTag: (params:any, content:any) => {

				var myUrl = content;

				this.urlPattern.lastIndex = 0;
				if ( !this.urlPattern.test( myUrl ) ) {
					myUrl = "";
				}

				return '<img src="' + myUrl + '" />';
			},
			closeTag: (params:any, content:any) => {
				return '';
			},
			displayContent: false
		},
		"justify": {
			openTag: (params:any, content:any) => {
				return '<span class="xbbcode-justify">';
			},
			closeTag: (params:any, content:any) => {
				return '</span>';
			}
		},
		"large": {
			openTag: (params:any, content:any) => {
				params = params || '';

				var colorCode = params.substr(1) || "inherit";
				this.colorNamePattern.lastIndex = 0;
				this.colorCodePattern.lastIndex = 0;
				if ( !this.colorNamePattern.test( colorCode ) ) {
					if ( !this.colorCodePattern.test( colorCode ) ) {
						colorCode = "inherit";
					} else {
						if (colorCode.substr(0,1) !== "#") {
							colorCode = "#" + colorCode;
						}
					}
				}


				return '<span class="xbbcode-size-36" style="color:' + colorCode + '">';
			},
			closeTag: (params:any, content:any) => {
				return '</span>';
			}
		},
		"left": {
			openTag: (params:any, content:any) => {
				return '<span class="xbbcode-left">';
			},
			closeTag: (params:any, content:any) => {
				return '</span>';
			}
		},
		"li": {
			openTag: (params:any, content:any) => {
				return "<li>";
			},
			closeTag: (params:any, content:any) => {
				return "</li>";
			},
			restrictParentsTo: ["list","ul","ol"]
		},
		"list": {
			openTag: (params:any, content:any) => {
				return '<ul>';
			},
			closeTag: (params:any, content:any) => {
				return '</ul>';
			},
			restrictChildrenTo: ["*", "li"]
		},
		"noparse": {
			openTag: (params:any, content:any) => {
				return '';
			},
			closeTag: (params:any, content:any) => {
				return '';
			},
			noParse: true
		},
		"ol": {
			openTag: (params:any, content:any) => {
				return '<ol>';
			},
			closeTag: (params:any, content:any) => {
				return '</ol>';
			},
			restrictChildrenTo: ["*", "li"]
		},
		"php": {
			openTag: (params:any, content:any) => {
				return '<span class="xbbcode-code">';
			},
			closeTag: (params:any, content:any) => {
				return '</span>';
			},
			noParse: true
		},
		"quote": {
			openTag: (params:any, content:any) => {
				return '<blockquote class="xbbcode-blockquote">';
			},
			closeTag: (params:any, content:any) => {
				return '</blockquote>';
			}
		},
		"right": {
			openTag: (params:any, content:any) => {
				return '<span class="xbbcode-right">';
			},
			closeTag: (params:any, content:any) => {
				return '</span>';
			}
		},
		"s": {
			openTag: (params:any, content:any) => {
				return '<span class="xbbcode-s">';
			},
			closeTag: (params:any, content:any) => {
				return '</span>';
			}
		},
		"size": {
			openTag: (params:any, content:any) => {
				params = params || '';

				var mySize = parseInt(params.substr(1),10) || 0;
				if (mySize < 4 || mySize > 40) {
					mySize = 14;
				}

				return '<span class="xbbcode-size-' + mySize + '">';
			},
			closeTag: (params:any, content:any) => {
				return '</span>';
			}
		},
		"small": {
			openTag: (params:any, content:any) => {
				params = params || '';

				var colorCode = params.substr(1) || "inherit";
				this.colorNamePattern.lastIndex = 0;
				this.colorCodePattern.lastIndex = 0;
				if ( !this.colorNamePattern.test( colorCode ) ) {
					if ( !this.colorCodePattern.test( colorCode ) ) {
						colorCode = "inherit";
					} else {
						if (colorCode.substr(0,1) !== "#") {
							colorCode = "#" + colorCode;
						}
					}
				}

				return '<span class="xbbcode-size-10" style="color:' + colorCode + '">';
			},
			closeTag: (params:any, content:any) => {
				return '</span>';
			}
		},

		"sub": {
			openTag: (params:any, content:any) => {
				return '<sub>';
			},
			closeTag: (params:any, content:any) => {
				return '</sub>';
			}
		},
		"sup": {
			openTag: (params:any, content:any) => {
				return '<sup>';
			},
			closeTag: (params:any, content:any) => {
				return '</sup>';
			}
		},

		"table": {
			openTag: (params:any, content:any) => {
				return '<table class="xbbcode-table">';
			},
			closeTag: (params:any, content:any) => {
				return '</table>';
			},
			restrictChildrenTo: ["tbody","thead", "tfoot", "tr"]
		},
		"tbody": {
			openTag: (params:any, content:any) => {
				return '<tbody>';
			},
			closeTag: (params:any, content:any) => {
				return '</tbody>';
			},
			restrictChildrenTo: ["tr"],
			restrictParentsTo: ["table"]
		},
		"tfoot": {
			openTag: (params:any, content:any) => {
				return '<tfoot>';
			},
			closeTag: (params:any, content:any) => {
				return '</tfoot>';
			},
			restrictChildrenTo: ["tr"],
			restrictParentsTo: ["table"]
		},
		"thead": {
			openTag: (params:any, content:any) => {
				return '<thead class="xbbcode-thead">';
			},
			closeTag: (params:any, content:any) => {
				return '</thead>';
			},
			restrictChildrenTo: ["tr"],
			restrictParentsTo: ["table"]
		},
		"td": {
			openTag: (params:any, content:any) => {
				return '<td class="xbbcode-td">';
			},
			closeTag: (params:any, content:any) => {
				return '</td>';
			},
			restrictParentsTo: ["tr"]
		},
		"th": {
			openTag: (params:any, content:any) => {
				return '<th class="xbbcode-th">';
			},
			closeTag: (params:any, content:any) => {
				return '</th>';
			},
			restrictParentsTo: ["tr"]
		},
		"tr": {
			openTag: (params:any, content:any) => {
				return '<tr class="xbbcode-tr">';
			},
			closeTag: (params:any, content:any) => {
				return '</tr>';
			},
			restrictChildrenTo: ["td","th"],
			restrictParentsTo: ["table","tbody","tfoot","thead"]
		},
		"u": {
			openTag: (params:any, content:any) => {
				return '<u>';
			},
			closeTag: (params:any, content:any) => {
				return '</u>';
			}
		},
		"ul": {
			openTag: (params:any, content:any) => {
				return '<ul>';
			},
			closeTag: (params:any, content:any) => {
				return '</ul>';
			},
			restrictChildrenTo: ["*", "li"]
		},
		"url": {
			openTag: (params:any, content:any) => {

				var myUrl;

				if (!params) {
					myUrl = content.replace(/<.*?>/g,"");
				} else {
					myUrl = params.substr(1);
				}

				this.urlPattern.lastIndex = 0;
				if ( !this.urlPattern.test( myUrl ) ) {
					myUrl = "#";
				}

				return '<a href="' + myUrl + '">';
			},
			closeTag: (params:any, content:any) => {
				return '</a>';
			}
		},
		/*
			The [*] tag is special since the user does not define a closing [/*] tag when writing their bbcode.
			Instead this module parses the code and adds the closing [/*] tag in for them. None of the tags you
			add will act like this and this tag is an exception to the others.
		*/
		"*": {
			openTag: (params:any, content:any) => {
				return "<li>";
			},
			closeTag: (params:any, content:any) => {
				return "</li>";
			},
			restrictParentsTo: ["list","ul","ol"]
		}
	};

	constructor() {
		this.initTags();
	}

	// create tag list and lookup fields
	initTags() {
		this.tagList = [];
		var prop,
			ii,
			len;
		for (prop in this.tags) {
			if (this.tags.hasOwnProperty(prop)) {
				if (prop === "*") {
					this.tagList.push("\\" + prop);
				} else {
					this.tagList.push(prop);
					if ( this.tags[prop].noParse ) {
						this.tagsNoParseList.push(prop);
					}
				}

				this.tags[prop].validChildLookup = {};
				this.tags[prop].validParentLookup = {};
				this.tags[prop].restrictParentsTo = this.tags[prop].restrictParentsTo || [];
				this.tags[prop].restrictChildrenTo = this.tags[prop].restrictChildrenTo || [];

				len = this.tags[prop].restrictChildrenTo.length;
				for (ii = 0; ii < len; ii++) {
					this.tags[prop].validChildLookup[ this.tags[prop].restrictChildrenTo[ii] ] = true;
				}
				len = this.tags[prop].restrictParentsTo.length;
				for (ii = 0; ii < len; ii++) {
					this.tags[prop].validParentLookup[ this.tags[prop].restrictParentsTo[ii] ] = true;
				}
			}
		}

		this.bbRegExp = new RegExp("<bbcl=([0-9]+) (" + this.tagList.join("|") + ")([ =][^>]*?)?>((?:.|[\\r\\n])*?)<bbcl=\\1 /\\2>", "gi");
		this.pbbRegExp = new RegExp("\\[(" + this.tagList.join("|") + ")([ =][^\\]]*?)?\\]([^\\[]*?)\\[/\\1\\]", "gi");
		this.pbbRegExp2 = new RegExp("\\[(" +this. tagsNoParseList.join("|") + ")([ =][^\\]]*?)?\\]([\\s\\S]*?)\\[/\\1\\]", "gi");

		// create the regex for escaping ['s that aren't apart of tags
		var closeTagList = [];
		for (var iii = 0; iii < this.tagList.length; iii++) {
			if ( this.tagList[iii] !== "\\*" ) { // the * tag doesn't have an offical closing tag
				closeTagList.push ( "/" +this. tagList[iii] );
			}
		}

		this.openTags = new RegExp("(\\[)((?:" + this.tagList.join("|") + ")(?:[ =][^\\]]*?)?)(\\])", "gi");
		this.closeTags = new RegExp("(\\[)(" + closeTagList.join("|") + ")(\\])", "gi");

	}

	// -----------------------------------------------------------------------------
	// private functions
	// -----------------------------------------------------------------------------

	checkParentChildRestrictions(parentTag:any, bbcode:any, bbcodeLevel:any, tagName:any, tagParams:any, tagContents:any, errQueue:any) {

		errQueue = errQueue || [];
		bbcodeLevel++;

		// get a list of all of the child tags to this tag
		var reTagNames = new RegExp("(<bbcl=" + bbcodeLevel + " )(" + this.tagList.join("|") + ")([ =>])","gi"),
			reTagNamesParts = new RegExp("(<bbcl=" + bbcodeLevel + " )(" + this.tagList.join("|") + ")([ =>])","i"),
			matchingTags = tagContents.match(reTagNames) || [],
			cInfo,
			errStr,
			ii,
			childTag,
			pInfo = this.tags[parentTag] || {};

		reTagNames.lastIndex = 0;

		if (!matchingTags) {
			tagContents = "";
		}

		for (ii = 0; ii < matchingTags.length; ii++) {
			reTagNamesParts.lastIndex = 0;
			childTag = (matchingTags[ii].match(reTagNamesParts))[2].toLowerCase();

			if ( pInfo && pInfo.restrictChildrenTo && pInfo.restrictChildrenTo.length > 0 ) {
				if ( !pInfo.validChildLookup[childTag] ) {
					errStr = "The tag \"" + childTag + "\" is not allowed as a child of the tag \"" + parentTag + "\".";
					errQueue.push(errStr);
				}
			}
			cInfo = this.tags[childTag] || {};
			if ( cInfo.restrictParentsTo.length > 0 ) {
				if ( !cInfo.validParentLookup[parentTag] ) {
					errStr = "The tag \"" + parentTag + "\" is not allowed as a parent of the tag \"" + childTag + "\".";
					errQueue.push(errStr);
				}
			}

		}

		tagContents = tagContents.replace(this.bbRegExp, (matchStr:any, bbcodeLevel:any, tagName:any, tagParams:any, tagContents:any ) => {
			errQueue = this.checkParentChildRestrictions(tagName.toLowerCase(), matchStr, bbcodeLevel, tagName, tagParams, tagContents, errQueue);
			return matchStr;
		});
		return errQueue;
	}

	/*
		This function updates or adds a piece of metadata to each tag called "bbcl" which
		indicates how deeply nested a particular tag was in the bbcode. This property is removed
		from the HTML code tags at the end of the processing.
	*/
	updateTagDepths(tagContents:any) {
		tagContents = tagContents.replace(/\<([^\>][^\>]*?)\>/gi, (matchStr:any, subMatchStr:any) => {
			var bbCodeLevel = subMatchStr.match(/^bbcl=([0-9]+) /);
			if (bbCodeLevel === null) {
				return "<bbcl=0 " + subMatchStr + ">";
			} else {
				return "<" + subMatchStr.replace(/^(bbcl=)([0-9]+)/, (matchStr:any, m1:any, m2:any) => {
					return m1 + (parseInt(m2, 10) + 1);
				}) + ">";
			}
		});
		return tagContents;
	}

	/*
		This function removes the metadata added by the updateTagDepths function
	*/
	unprocess(tagContent:any) {
		return tagContent.replace(/<bbcl=[0-9]+ \/\*>/gi,"").replace(/<bbcl=[0-9]+ /gi,"&#91;").replace(/>/gi,"&#93;");
	}

	replaceFunct = (matchStr:any, bbcodeLevel:any, tagName:any, tagParams:any, tagContents:any) => {

		tagName = tagName.toLowerCase();

		var processedContent;
		if (this.tags[tagName].noParse) {
			processedContent = this.unprocess(tagContents)
		} else {
			processedContent = tagContents.replace(this.bbRegExp, this.replaceFunct)
		}
		var openTag = this.tags[tagName].openTag(tagParams,processedContent);
		var closeTag = this.tags[tagName].closeTag(tagParams,processedContent);

		if ( this.tags[tagName].displayContent === false) {
			processedContent = "";
		}

		return openTag + processedContent + closeTag;
	};

	parse(config:any) {
		var output = config.text;
		output = output.replace(this.bbRegExp, this.replaceFunct);
		return output;
	}

	/*
		The star tag [*] is special in that it does not use a closing tag. Since this parser requires that tags to have a closing
		tag, we must pre-process the input and add in closing tags [/*] for the star tag.
		We have a little levaridge in that we know the text we're processing wont contain the <> characters (they have been
		changed into their HTML entity form to prevent XSS and code injection), so we can use those characters as markers to
		help us define boundaries and figure out where to place the [/*] tags.
	*/
	fixStarTag(text:any) {
		text = text.replace(/\[(?!\*[ =\]]|list([ =][^\]]*)?\]|\/list[\]])/ig, "<");
		text = text.replace(/\[(?=list([ =][^\]]*)?\]|\/list[\]])/ig, ">");

		while (text !== (text = text.replace(/>list([ =][^\]]*)?\]([^>]*?)(>\/list])/gi, (matchStr:any, contents:any, endTag:any) => {

			var innerListTxt = matchStr;
			while (innerListTxt !== (innerListTxt = innerListTxt.replace(/\[\*\]([^\[]*?)(\[\*\]|>\/list])/i, (matchStr:any, contents:any, endTag:any) => {
				if (endTag.toLowerCase() === ">/list]") {
					endTag = "</*]</list]";
				} else {
					endTag = "</*][*]";
				}
				return "<*]" + contents + endTag;
			})));

			innerListTxt = innerListTxt.replace(/>/g, "<");
			return innerListTxt;
		})));

		// add ['s for our tags back in
		text = text.replace(/</g, "[");
		return text;
	}

	addBbcodeLevels(text:any) {
		while ( text !== (text = text.replace(this.pbbRegExp, (matchStr:any, tagName:any, tagParams:any, tagContents:any) => {
			matchStr = matchStr.replace(/\[/g, "<");
			matchStr = matchStr.replace(/\]/g, ">");
			return this.updateTagDepths(matchStr);
		})) );
		return text;
	}

	// -----------------------------------------------------------------------------
	// public functions
	// -----------------------------------------------------------------------------

	// API
	addTags(newtags:any) {
		var tag;
		for (tag in newtags) {
			this.tags[tag] = newtags[tag];
		}
		this.initTags();
	};

	process(config:any): I.IBBCodeRarserResponse {

		var ret:I.IBBCodeRarserResponse = {
			html: "",
			error: false,
			errorQueue: []};

		var errQueue = [];

		config.text = config.text.replace(/</g, "&lt;"); // escape HTML tag brackets
		config.text = config.text.replace(/>/g, "&gt;"); // escape HTML tag brackets

		config.text = config.text.replace(this.openTags, (matchStr:any, openB:any, contents:any, closeB:any) => {
			return "<" + contents + ">";
		});
		config.text = config.text.replace(this.closeTags, (matchStr:any, openB:any, contents:any, closeB:any) => {
			return "<" + contents + ">";
		});

		config.text = config.text.replace(/\[/g, "&#91;"); // escape ['s that aren't apart of tags
		config.text = config.text.replace(/\]/g, "&#93;"); // escape ['s that aren't apart of tags
		config.text = config.text.replace(/</g, "["); // escape ['s that aren't apart of tags
		config.text = config.text.replace(/>/g, "]"); // escape ['s that aren't apart of tags

		// process tags that don't have their content parsed
		while ( config.text !== (config.text = config.text.replace(this.pbbRegExp2, (matchStr:any, tagName:any, tagParams:any, tagContents:any) => {
			tagContents = tagContents.replace(/\[/g, "&#91;");
			tagContents = tagContents.replace(/\]/g, "&#93;");
			tagParams = tagParams || "";
			tagContents = tagContents || "";
			return "[" + tagName + tagParams + "]" + tagContents + "[/" + tagName + "]";
		})) );

		config.text = this.fixStarTag(config.text); // add in closing tags for the [*] tag
		config.text = this.addBbcodeLevels(config.text); // add in level metadata

		errQueue = this.checkParentChildRestrictions("bbcode", config.text, -1, "", "", config.text, null);

		ret.html = this.parse(config);

		if ( ret.html.indexOf("[") !== -1 || ret.html.indexOf("]") !== -1) {
			errQueue.push("Some tags appear to be misaligned.");
		}

		if (config.removeMisalignedTags) {
			ret.html = ret.html.replace(/\[.*?\]/g,"");
		}

		if (config.addInLineBreaks) {
			ret.html = '<div style="white-space:pre-wrap;">' + ret.html + '</div>';
			//ret.html = ret.html.replace(/(?:\r\n|\r|\n)/g, '<br />');
		}

		if (!config.escapeHtml) {
			ret.html = ret.html.replace("&#91;", "["); // put ['s back in
			ret.html = ret.html.replace("&#93;", "]"); // put ['s back in
		}

		ret.error = errQueue.length !== 0;
		ret.errorQueue = errQueue;

		return ret;
	};
}

export const BBCodesParser = new XBBCodes();
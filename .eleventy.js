const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const syntaxHighlightFunction = syntaxHighlight.pairedShortcode;
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

// 0 => type to show all
// 1 => type to show from 1+
// 1,2 => type to show from 1 to 2
// 2,3 5,6 => type to show from 2 to 3 and from 5 to 6
//   in other words, show 1 and 4 and 7+

function getTypingConfigResults(typingConfig, charIndex, multipleCursors = false) {
	let lowestIndex = 99999999;
	let waitToShow = {};
	let showCursor = false;

	for(let cfg of typingConfig) {
		let start, end;
		cfg = "" + cfg;

		if(cfg.indexOf(",") > -1) { // start,length
			let split = cfg.split(",");
			start = parseInt(split[0], 10);
			end = split.length > 1 ? start + parseInt(split[1], 10) : charIndex+1;
		} else if(cfg.indexOf("-") > -1) { // start,end
			let split = cfg.split("-");
			start = parseInt(split[0], 10);
			end = split.length > 1 ? parseInt(split[1], 10) : charIndex+1;
		} else {
			start = parseInt(cfg, 10);
			end = charIndex + 1;
		}

		for(let j = start+1; j < end; j++) {
			waitToShow[j] = true;
		}
		if(multipleCursors && start === charIndex) {
			showCursor = true;
		}
		lowestIndex = Math.min(lowestIndex, start);
	}

	if(!multipleCursors && lowestIndex === charIndex) {
		showCursor = true;
	}
	return { showTyped: !waitToShow[charIndex], showCursor };
}


let characterIndex = 0;
function modifyNode(node, typingConfig, multipleCursors) {
	characterIndex++;
	let classes = ["typer-letter"];
	let {showTyped, showCursor} = getTypingConfigResults(typingConfig, characterIndex, multipleCursors);

	if(showTyped) {
		classes.push("typer-letter-typed typer-letter-typed-initial");
	}
	if(showCursor) {
		classes.push("typer-letter-cursor typer-letter-cursor-initial");
	}
	node.className = classes.join(" ");
	node.setAttribute("data-index", characterIndex);
	return node;
}
function convertStringToCharacterArray(str) {
	return Array.from(str);
}
function walkTree(doc, root, typingConfig = [], multipleCursors = false) {
	for(let node of root.childNodes) {
		if(node.nodeType === 3) {
			let characters = convertStringToCharacterArray(node.textContent);
			for(let char of characters) {
				let newTextEl = doc.createElement("span");
				modifyNode(newTextEl, typingConfig, multipleCursors);
				newTextEl.innerHTML = char;
				node.parentNode.insertBefore(newTextEl, node);
			}
			node.remove();
		} else if(node.nodeType === 1) {
			if(node.classList.contains("typer-letter")) {
				continue;
			}
			if(node.nodeName === "BR") {
				modifyNode(node, typingConfig, multipleCursors);
			} else {
				walkTree(doc, node, typingConfig, multipleCursors);
			}
		}
	}
}

module.exports = function(eleventyConfig) {
	eleventyConfig.addPlugin(syntaxHighlight);
	eleventyConfig.addPassthroughCopy("./static/");
	eleventyConfig.addPassthroughCopy({
		"./slides/*.css": "/css/",
		"./node_modules/resizeasaurus/resizeasaurus.css": "/static/resizeasaurus.css",
		"./node_modules/resizeasaurus/resizeasaurus.js": "/static/resizeasaurus.js",
	});
	eleventyConfig.addCollection("slide", function(collectionApi) {
		return collectionApi.getFilteredByGlob("./slides/**/*.html").sort((a,b) => {
			if(a.url < b.url) {
				return -1;
			} else if(a.url > b.url) {
				return 1;
			}
			return 0;
		});
	});
	
	eleventyConfig.addShortcode("level", function(level) {
		return `Web Site Build Level ${level} of 10 Complete 🏆`;
	})
	
	eleventyConfig.addFilter("getJsdomLetters", function(content, codeFormat, typingConfig, multipleCursors) {
		let highlightedContent = syntaxHighlightFunction(content, codeFormat, "", { trim: false });
		let jsdoc = new JSDOM(`<html><body>${highlightedContent}</body></html>`);
		let { document } = jsdoc.window;
		characterIndex = 0;
		walkTree(document, document.body, typingConfig, multipleCursors);
		return document.body.innerHTML;
	})
};

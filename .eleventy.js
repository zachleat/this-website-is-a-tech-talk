const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const syntaxHighlightFunction = syntaxHighlight.pairedShortcode;
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

// 0 => type to show all
// 1 => type to show from 1+
// 1,2 => type to show from 1 to 2
// 2,3 5,6 => type to show from 2 to 3 and from 5 to 6
//   in other words, show 1 and 4 and 7+

function getTypingConfigResults(typingConfig, charIndex) {
	let lowestIndex = 99999999;
	let waitToShow = {};

	for(let cfg of typingConfig) {
		let split = ("" + cfg).split(",");
		let start = parseInt(split[0], 10);
		let end = split.length > 1 ? start + parseInt(split[1], 10) : charIndex+1;

		for(let j = start+1; j < end; j++) {
			waitToShow[j] = true;
		}
		lowestIndex = Math.min(lowestIndex, start);
	}

	let showCursor = false;
	if(lowestIndex === charIndex) {
		showCursor = true;
	}
	return { showTyped: !waitToShow[charIndex], showCursor };
}

let characterIndex = 0;
function walkTree(doc, root, typingConfig = []) {
	for(let node of root.childNodes) {
		if(node.nodeType === 3) {
			let characters = node.textContent.split("");
			for(let char of characters) {
				let newTextEl = doc.createElement("span");
				characterIndex++;
				let classes = ["typer-letter"];
				let {showTyped, showCursor} = getTypingConfigResults(typingConfig, characterIndex);

				if(showTyped) {
					classes.push("typer-letter-typed typer-letter-typed-initial");
				}
				if(showCursor) {
					classes.push("typer-letter-cursor");
				}
				newTextEl.className = classes.join(" ");
				newTextEl.innerHTML = char;
				newTextEl.setAttribute("data-index", characterIndex);
				node.parentNode.insertBefore(newTextEl, node);
			}
			node.remove();
		} else if(node.nodeType === 1) {
			if(node.classList.contains("typer-letter")) {
				continue;
			}
			walkTree(doc, node, typingConfig);
		}
	}
}

module.exports = function(eleventyConfig) {
	eleventyConfig.addPlugin(syntaxHighlight);
	eleventyConfig.addPassthroughCopy("./static/");
	eleventyConfig.addPassthroughCopy({
		"./node_modules/resizeasaurus/resizeasaurus.css": "/static/resizeasaurus.css",
		"./node_modules/resizeasaurus/resizeasaurus.js": "/static/resizeasaurus.js",
	});
	
	eleventyConfig.addFilter("getJsdomLetters", function(content, typingConfig) {
		let highlightedContent = syntaxHighlightFunction(content, "html");
		let jsdoc = new JSDOM(`<html><body>${highlightedContent}</body></html>`);
		let { document } = jsdoc.window;
		characterIndex = 0;
		walkTree(document, document.body, typingConfig);
		return document.body.innerHTML;
	})
};
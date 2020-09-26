const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const syntaxHighlightFunction = syntaxHighlight.pairedShortcode;
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

let characterIndex = 0;

function walkTree(doc, root, showUpToIndex = 0, showAfterIndex = undefined) {
  for(let node of root.childNodes) {
    if(node.nodeType === 3) {
      let characters = node.textContent.split("");
      for(let char of characters) {
        let newTextEl = doc.createElement("span");
        characterIndex++;
        let classes = ["typer-letter"];
        // console.log( char, characterIndex ,showUpToIndex, showAfterIndex );
        if(showUpToIndex && characterIndex <= showUpToIndex ||
          showAfterIndex && characterIndex >= showAfterIndex) {
          classes.push("typer-letter-typed typer-letter-typed-initial");
        }
        if(showUpToIndex === characterIndex) {
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
      walkTree(doc, node, showUpToIndex, showAfterIndex);
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
  
  eleventyConfig.addFilter("getJsdomLetters", function(content, showUpToIndex, showAfterIndex) {
    let highlightedContent = syntaxHighlightFunction(content, "html");
    let jsdoc = new JSDOM(`<html><body>${highlightedContent}</body></html>`);
    let { document } = jsdoc.window;
    characterIndex = 0;
    walkTree(document, document.body, showUpToIndex, showAfterIndex);
    return document.body.innerHTML;
  })
};

const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const SyntaxHighlightCharacterWrap = syntaxHighlight.characterWrap;
const graymatter = require("gray-matter");

module.exports = function(eleventyConfig) {
	eleventyConfig.addPlugin(syntaxHighlight);
	eleventyConfig.addPassthroughCopy("./static/");
	eleventyConfig.addPassthroughCopy("./layouts/");
	eleventyConfig.addPassthroughCopy({
		"./slides/css/": "/css/",
		"./node_modules/resizeasaurus/resizeasaurus.css": "/static/resizeasaurus.css",
		"./node_modules/resizeasaurus/resizeasaurus.js": "/static/resizeasaurus.js",
		"./node_modules/liquidjs/dist/liquid.browser.esm.js": "/static/liquid.js",
		"./node_modules/speedlify-score/speedlify-score.*": "/static/",
	});

	eleventyConfig.addCollection("slide", function(collectionApi) {
		return collectionApi.getFilteredByGlob("./slides/**/*.html").sort((a,b) => {
			let ak = parseFloat(a.fileSlug, 10);
			let bk = parseFloat(b.fileSlug, 10);
			if(ak < bk) {
				return -1;
			} else if(ak > bk) {
				return 1;
			}
			return 0;
		});
	});
	
	eleventyConfig.addShortcode("level", function(level) {
		return `Web Site Build Level ${level} of 10 Complete 🏆`;
	});
	
	eleventyConfig.addFilter("previewHtml", function(content) {
		return content.split("~/twitter/@").join("https://unavatar.now.sh/twitter/");
	});

	eleventyConfig.addNunjucksAsyncFilter("getJsdomLetters", function(content, codeFormat, typingConfig, multipleCursors, callback) {
		let wrap = new SyntaxHighlightCharacterWrap();
		wrap.setTypingConfigArray(typingConfig);
		wrap.setMultipleCursors(multipleCursors);
		wrap.addContentTransform((content) => {
			// don’t waste time doing those huge templates in dev mode
			if(process.env.ELEVENTY_DEV && content.length > 8000) {
				console.warn( "⚠️⚠️⚠️ Warning: you’re in development mode!" );
				return false;
			}
		});

		wrap.wrapContent(content, codeFormat).then(wrappedContent => {
			callback(null, wrappedContent);
		});
	});

	eleventyConfig.addFilter("findCollectionIndex", (collection, page) => {
		let j = 0;
		let index;
		for (let item of collection) {
			if (
				item.inputPath === page.inputPath &&
				item.outputPath === page.outputPath
				) {
					return j;
				}
				j++;
		}
	});

	eleventyConfig.addFilter("getFileContents", filepath => {
		let matter = graymatter.read(filepath);
		return matter.content;
	});
	
	eleventyConfig.addFilter("toJSON", function(obj) {
		return JSON.stringify(obj);
	});
	
	eleventyConfig.setLiquidOptions({
		dynamicPartials: true,
		strictFilters: true
	});
	
	eleventyConfig.setBrowserSyncConfig({
		ghostMode: false,
		ui: false,
		snippetOptions: {
			ignorePaths: "benchmark/*"
		}
	});
};

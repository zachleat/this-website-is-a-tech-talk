const PerfLeaderboard = require("performance-leaderboard");
const fsp = require("fs").promises;

(async function() {

	let urlMap = {
		"https://competent-murdock-3b6689.netlify.app/": "8e"
	};
	let urls = [
		// "https://fervent-beaver-9fea8f.netlify.app/benchmark/6/",
		// "https://fervent-beaver-9fea8f.netlify.app/benchmark/7a/",
		// "https://fervent-beaver-9fea8f.netlify.app/benchmark/7c/",
		"https://competent-murdock-3b6689.netlify.app/",
	];

	let results = await PerfLeaderboard(urls, 3);
	for(let result of results) {
		let slug;
		if(urlMap[result.requestedUrl]) {
			slug = urlMap[result.requestedUrl];
		} else {
			slug = result.url.split("/").filter(entry => !!entry).pop();
		}

		await fsp.writeFile(`./_data/benchmark/${slug}.json`, JSON.stringify(result, null, 2));
	}
})();

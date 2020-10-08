const PerfLeaderboard = require("performance-leaderboard");
const fsp = require("fs").promises;

(async function() {

	let urls = [
		"https://fervent-beaver-9fea8f.netlify.app/benchmark/7c/",
	];

	let results = await PerfLeaderboard(urls, 3);
	for(let result of results) {
		let slug = result.url.split("/").filter(entry => !!entry).pop();
		console.log( slug );
		await fsp.writeFile(`./_data/benchmark/${slug}.json`, JSON.stringify(result, null, 2));
	}
})();

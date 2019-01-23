const limit = require('./lib/awaitlimit');

async function main() {
	const letters = ['A', 'B', 'C', 'D', 'E', 'F'];

	// .all runs async functions with limited concurrency
	await limit.all(2, [
		async () => {
			await printWithDelay('.limit A');
		},
		async () => {
			await printWithDelay('.limit B');
		},
		async () => {
			await printWithDelay('.limit C');
		},
	]);

	// .map iterates over a collection
	const resultsMap = await limit.map(3, letters, async letter => {
		await delay();
		return `.map ${letter}`;
	});
	console.log(resultsMap);

	// .filter iterates and filters
	const resultsFilter = await limit.filter(3, letters, async letter => {
		await delay();
		return ['A', 'C', 'F'].includes(letter);
	});
	console.log(resultsFilter);

	// .flatMap maps and flattens (if Node version supports the native Array.prototype.flatMap)
	const resultsFlatmap = await limit.flatMap(3, letters, async letter => {
		await delay();
		return [`${letter}--`, letter];
	});
	console.log(resultsFlatmap);
}

/**
 * These are helpers
 */

async function printWithDelay(str) {
	await delay();
	console.log(str);
	return str;
}

function delay() {
	return new Promise(resolve => {
		setTimeout(resolve, Math.round(Math.random() * 1000));
	});
}

main()
	.then(() => {
		process.exit();
	})
	.catch(e => {
		console.error(e);
		process.exit(1);
	});

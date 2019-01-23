async function limiter(concurrency, tasks) {
	if (!Number.isInteger(concurrency)) {
		throw new Error(`Concurrency must be an integer, ${concurrency} given`);
	}

	const results = [];
	const errors = [];
	let index = 0;

	// This function processes one task at a time until there are no tasks left
	async function worker() {
		while (index < tasks.length) {
			const i = index++;
			const task = tasks[i];

			if (typeof task !== 'function') {
				errors[i] = new Error(`Task must be a function, ${typeof task} given`);
				continue;
			}

			try {
				results[i] = await task();
			} catch (e) {
				errors[i] = e;
			}
		}
	}

	// Create array of workers up to the desired concurrency
	const workers = new Array(Math.min(concurrency, tasks.length)).fill(worker);

	// Execute all the workers in parallel
	await Promise.all(workers.map(fn => fn()));

	if (errors.length) {
		const err = new Error('Chunky encountered errors');
		err.details = errors;
		throw err;
	}

	return results;
}

module.exports = {
	async each(tasks) {
		return await limiter(1, tasks);
	},
	async all(concurrency, tasks) {
		return await limiter(concurrency, tasks);
	},
	async map(concurrency, array, iterator) {
		return await limiter(concurrency, array.map(i => () => iterator(i)));
	},
	async filter(concurrency, array, iterator) {
		const result = await limiter(concurrency, array.map(i => () => iterator(i)));
		return array.filter((el, i) => result[i]);
	},
};

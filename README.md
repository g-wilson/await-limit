# Await Limit

Easy control flow for running lots and lots of async functions with a concurrency limit.

Designed to have a nicer API than some of the other similar libraries which perform throttling and limiting.

Ideally it should be a drop-in replacement for `Promise.all`. However, this is not possible - the promises themselves _must_ be wrapped in a function for it to be effectively batched.

## Usage

```js
const limit = require('await-limit');
```

#### .all

Runs all of the provided async functions as fast as possible up to a provided concurrency limit.

Resolves to an array of the value resolved by each task.

```js
const concurrency = 2;

const results = await limit.all(concurrency, [
	async () => {},
	async () => {},
	async () => {},
	async () => {},
	async () => {},
]);
```

```js
const concurrency = 5;

const userIds = ['123', '456' /* lots more items */];

const results = await limit.all(concurrency, tasks.map(userId => async () => doDatabaseUpdate({ userId })));
```

#### .map

Runs the provided async function against each item in a provided array as fast as possible up to a provided concurrency limit.

Resolves to an array of the values resolved by each invocation of the function.

```js
const concurrency = 25;

const userIds = await getUsers();

const result = await limit.map(concurrency, userIds, async userId => {
	const pref = await getUserPreference('marketingEmailConsent');
	if (!pref) return false;

	await sendMarketingEmail(userId);

	return true;
});
```

#### .filter

Runs the provided async function against each item in a provided array as fast as possible up to a provided concurrency limit.

Resolves to a new array where each item from the original array is omitted if the resolved value of the function is falsy.

```js
const concurrency = 25;

const userIds = await getUsers();

const result = await limit.filter(concurrency, userIds, async userId => {
	const pref = await getUserPreference('marketingEmailConsent');
	return pref;
});
```

#### .each

Runs each async function one after the other and collects the results.

```js
const results = await limit.each([
	async () => {
		// First operation
		return 'foo';
	},

	async () => {
		// First operation
		return 'bar';
	},
]);

console.log(results); // [ 'foo', 'bar' ]
```

### Error handling

This library handles errors quite differently to `Promise.all`.

It will continue to invoke all of the provided tasks until completion, and collect any error states as it goes.

**Afterwards, if the errors array has length, it will throw.**

```js
{
	message: "AwaitLimit encountered errors",
	details: [
		undefined, // Tasks which did not error
		undefined,
		{} // Error from a failed task
	],
}
```

if this is not desirable in your use case, you must make sure to handle errors inside the tasks, and then populate the result array with the data you need to evaluate success/failure.

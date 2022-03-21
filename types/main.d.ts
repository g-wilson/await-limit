declare module 'await-limit' {

	export type Task<Tout> = () => Promise<Tout>

	export type IteratorTask<Tin, Tout> = (value: Tin) => Promise<Tout>

	export function each<Tout>(tasks: Task<Tout>[]): Tout[]
	export function all<Tout>(concurrency: number, tasks: Task<Tout>[]): Tout[]
	export function map<Tin, Tout>(concurrency: number, items: Tin[], iterator: IteratorTask<Tin>): Tout[]
	export function filter<T>(concurrency: number, items: T[], iterator: IteratorTask<T>): T[]

}

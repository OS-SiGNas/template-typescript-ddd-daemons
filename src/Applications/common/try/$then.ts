import type { Try } from "#Domain";

export const $then: Try = async (promise) =>
	new Promise((resolve) => {
		promise
			.then((res) => resolve([null, res]))
			.catch((error) => {
				if (error instanceof Error) return resolve([error]);
				const type = error === null ? "null" : typeof error;
				const cause = `throw type: ${type}`;
				return resolve([new Error(`** UnhandledThrow ** (${String(error)})`, { cause })]);
			});
	});

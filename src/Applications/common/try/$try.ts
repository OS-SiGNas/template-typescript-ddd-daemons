import type { Try } from "#Domain";

export const $try: Try = async (promise) => {
	try {
		return [null, await promise];
	} catch (error) {
		if (error instanceof Error) return [error];
		const type = error === null ? "null" : typeof error;
		const cause = `throw type: ${type}`;
		return [new Error(`** UnhandledThrow ** (${String(error)})`, { cause })];
	}
};

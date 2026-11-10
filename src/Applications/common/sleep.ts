type SleepFunction = (seg: number, name: string) => Promise<void>;

export const Sleep = (debug: boolean): SleepFunction => {
	const __log = (msg: string): void => console.info("[INFO] * Sleep: " + msg);

	return async (seg, name) =>
		new Promise((resolve) => {
			if (debug) __log(`${name} -> ${seg} seg`);
			const timeout = setTimeout(() => {
				if (debug) __log("ready: " + name);
				return resolve(clearTimeout(timeout));
			}, seg * 1000);
		});
};

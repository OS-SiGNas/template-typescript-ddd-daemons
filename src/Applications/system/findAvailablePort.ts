import { Server } from "node:http";

export const findAvailablePort = async (target: number): Promise<number> => {
	const __server = new Server();
	let __isFound: boolean = false;

	const __find = async (p: number): Promise<void> => {
		return new Promise((resolve, reject) => {
			__server.on("error", (e) => reject(e));
			__server.listen(p, () => resolve());
		});
	};

	const __close = (): void => {
		__server.closeIdleConnections();
		__server.closeAllConnections();
		__server.close((error) => console.error(error));
		process.removeListener("SIGINT", __close);
		process.removeListener("SIGTERM", __close);
	};

	process.on("SIGINT", __close);
	process.on("SIGTERM", __close);

	while (!__isFound) {
		await __find(target)
			.then(() => (__isFound = true))
			.catch((e: Error) => {
				target += 1;
				console.trace(e.message);
			});
	}

	if (__server.listening) __close();
	return target;
};

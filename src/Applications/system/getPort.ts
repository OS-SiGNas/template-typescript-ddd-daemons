/**
 * @description this function is for validate any port from external service
 * @param target string port from argv, env or other
 * @return port number < 1024 and > 65535; if target is incompatible return 0 for random port */
export const getPort = (target?: string | number): number => {
	if (target === undefined) return 0;
	const port = typeof target === "string" ? parseInt(target) : target;

	if (isNaN(port)) {
		console.log(`[WARN] Port '${target}' incompatible`);
		return 0;
	}

	if (port < 1024 || port > 65535) {
		console.log(`[WARN] Port '${port}' is unavailable`);
		return 0;
	}

	return port;
};

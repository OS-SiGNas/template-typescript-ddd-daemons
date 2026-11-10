import type { Secrets, SecretsParser } from "#Domain";

export const secretsParser: SecretsParser = (origin) => {
	const _error = (v: string): Error => new (class EnvironmentVariableError extends Error { })(`variable ${v} is undefined`);
	const _get = (s: keyof Secrets): string | number => {
		const variable = (origin as Secrets)[s];
		if (variable === undefined) throw _error(s);
		console.log(`v ${s} `);
		return variable;
	};

	const _secrets: Secrets = {
		APP_NAME: _get("APP_NAME") as string,
		HTTP_PORT: +_get("HTTP_PORT"),
		HTTP_TIMEOUT: +_get("HTTP_TIMEOUT"),
		THIS_URL: _get("THIS_URL") as string,
		LOGGER_INTERVAL: +_get("LOGGER_INTERVAL"),
		LOGGER_WORKER_FILE: _get("LOGGER_WORKER_FILE") as string,
		IGUANA: new String(_get("IGUANA")) as string,
	};

	return _secrets;
};

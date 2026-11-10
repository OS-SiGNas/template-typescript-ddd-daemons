export type Environment = "development" | "production" | "testing" | "debug";

export interface HttpBackendTarget {
	IGUANA: string;
}

export interface LoggerSecrets {
	LOGGER_INTERVAL: number;
	LOGGER_WORKER_FILE: string;
}

interface HttpSecrets {
	HTTP_PORT: number;
	HTTP_TIMEOUT: number;
}

export type SecretsParser = (o: object) => Readonly<Secrets>;

export interface Secrets extends LoggerSecrets, HttpSecrets, HttpBackendTarget {
	APP_NAME: string;
	THIS_URL: string;
}

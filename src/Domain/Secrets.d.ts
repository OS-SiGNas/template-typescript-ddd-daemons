export type Environment = "development" | "production" | "testing" | "debug";

export interface LoggerSecrets {
	LOGGER_INTERVAL: number;
	LOGGER_WORKER_FILE: string;
}

interface HttpSecrets {
	HTTP_PORT: number;
	HTTP_TIMEOUT: number;
}

export interface Secrets extends LoggerSecrets, HttpSecrets {
	APP_NAME: string;
	THIS_URL: string;
}

export type SecretsParser = (o: object) => Readonly<Secrets>;

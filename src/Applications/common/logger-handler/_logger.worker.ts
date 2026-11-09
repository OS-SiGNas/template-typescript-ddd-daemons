import { parentPort } from "node:worker_threads";
import { createWriteStream } from "node:fs";
import { Console } from "node:console";

import type { LogObject } from "#Domain";

new (class LoggerWorker {
	#hasError: boolean = false;
	readonly #chunks: Set<LogObject> = new Set();
	readonly #interval: NodeJS.Timeout;
	readonly #file = new Console(
		// stream logs files
		createWriteStream("./stdout.log"),
		createWriteStream("./stderr.log"),
	);

	constructor() {
		try {
			if (parentPort === null) throw new (class ThreadWorkerError extends Error {})("parent port is null");
			parentPort
				.on("messageerror", (e: Error) => console.error(e))
				.on("close", this.#shutdownWorker)
				.on("message", this.#message);

			process
				.on("SIGINT", (signal) => {
					console.log(signal);
					this.#shutdownWorker();
				})
				.on("SIGTERM", (signal) => {
					console.log(signal);
					this.#shutdownWorker();
				})
				.on("exit", (code) => {
					console.log(code);
					this.#shutdownWorker();
				});

			const firstLogTimeout = global.setTimeout(() => {
				this.#log();
				clearTimeout(firstLogTimeout);
			}, 1000);

			this.#interval = global.setInterval(this.#log, 30000);
		} catch (error) {
			this.#hasError = true;
			this.#log();
			console.error(error);
			this.#file.error(error);
			this.#shutdownWorker();
		}
	}

	readonly #shutdownWorker = (): void => {
		clearInterval(this.#interval);
		this.#log();
		process.exit(this.#hasError ? 1 : 0);
	};

	readonly #message = ([log, ...meta]: [LogObject, ...meta: unknown[]]): void => {
		if (meta.length !== 0) console.debug(...meta);
		this.#chunks.add(log);
	};

	readonly #log = (): void => {
		if (this.#chunks.size === 0) return;

		for (const c of this.#chunks) {
			const __fileOutput = `${c.level}\t${c.date}\t${c.name}\t${c.message}`;
			const __getStdFormat = (e: string): string => `${c.date} ${e} [${c.level}] [${c.name}] ${c.message}\n`;

			if (c.level === "INFO") {
				this.#file.info(__fileOutput);
				console.log(__getStdFormat("🟢"));
			}

			if (c.level === "WARN") {
				this.#file.warn(__fileOutput);
				console.log(__getStdFormat("🟠"));
			}

			if (c.level === "DEBUG") {
				this.#file.debug(__fileOutput);
				console.log(__getStdFormat("🔵"));
			}

			if (c.level === "ERROR") {
				this.#file.error(__fileOutput);
				console.log(__getStdFormat("🛑"));
			}

			if (c.level === "FATAL") {
				this.#file.error(__fileOutput);
				console.log(__getStdFormat("⚪"));
			}
		}

		this.#chunks.clear();
	};
})();

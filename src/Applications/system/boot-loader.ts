import type { SystemDaemon, DomainEventBus, Environment, ILogger } from "#Domain";

import { DEBUG, NODE_ENV, secrets } from "#Config";
import { Actions, bus } from "#Domain";
import { httpServer } from "#Infrastructure/daemons/http/make.ts";
import { Logger } from "#common/logger-handler/make.ts";

/**
 * @description Main
 * @description default application boot loader */
new (class {
	readonly #daemons: SystemDaemon[] = [httpServer];
	readonly #bus: DomainEventBus = bus;
	readonly #logger: ILogger = new Logger(secrets.APP_NAME);
	readonly #environment: Environment = NODE_ENV;
	readonly #debug: boolean = DEBUG;
	#hasError: boolean = false;
	constructor() {
		if (this.#daemons.length === 0) {
			console.error("[FATAL]: system daemons empty\n[!] shuting down");
			this.#hasError = true;
			void this.#shutdown();
		} else {
			void this.#boot();
			process.on("SIGTERM", this.#shutdown);
			process.on("SIGINT", this.#shutdown);
			this.#bus.on(Actions.SYSTEM_SHUTDOWN, this.#shutdown);
			this.#bus.on(Actions.SYSTEM_REBOOT, this.#reboot);
		}
	}

	readonly #boot = async (): Promise<void> => {
		this.#logger.info("██████ STARTING APPLICATION ██████");
		if (this.#environment === "development") this.#logger.info("👽 DEV MODE 👽");
		if (this.#environment === "testing") this.#logger.info("🪲 TEST MODE 🪲");
		if (this.#environment === "production") this.#logger.info("🔥 ON 🔥");
		try {
			await Promise.all(this.#daemons.map((d) => d.start()));
			this.#logger.info(this.#daemons.length + ` system daemons started successfully`);
		} catch (e) {
			this.#logger.error("██████ Error starting daemons ██████\n");
			this.#hasError = true;
			const error = e instanceof Error ? e : new Error(String(e));
			if (this.#debug) this.#logger.error("DEBUG TRACE:\n", error);
			else this.#logger.error(`${error.name}: ${error.message}`);
			return await Promise.reject(this.#shutdown());
		}
	};

	readonly #reboot = async (): Promise<void> => {
		this.#logger.warn("Rebooting daemons");
		await Promise.all(this.#daemons.map((d) => d.restart()));
		return await Promise.resolve();
	};

	readonly #shutdown = async (): Promise<never> => {
		this.#logger.info("██████ SHUTING DOWN ██████");
		if (this.#daemons.length !== 0) {
			const daemonsSettled = await Promise.allSettled(this.#daemons.map((d) => d.stop()));
			for (const d of daemonsSettled) {
				if (d.status === "rejected") this.#logger.error("daemon stop protocol failed", d.reason);
				else this.#logger.info("daemon stoped");
			}
		}
		this.#bus.removeAllListeners();
		this.#logger.info("Shudown protocol successfully");
		return process.exit(this.#hasError ? 1 : 0);
	};
})();

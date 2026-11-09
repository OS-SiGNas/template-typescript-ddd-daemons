import { Logger } from "#common/logger-handler/make.ts";
import { uuidGenerator } from "#common/uuid-generator.ts";
import { BadRequestException400 } from "./errors/error.factory.ts";

import type { UUID } from "crypto";
import type { ILogger } from "./ILogger.ts";

type Session = undefined | string | null | object;

export class RequestBusiness<Body extends object, Params extends object, Query extends object> {
	readonly #id: UUID = uuidGenerator();
	readonly #session: Session;
	readonly #logger: ILogger;

	readonly #body: Body;
	readonly #params: Params;
	readonly #query: Query;

	constructor(d: Readonly<{ session: Session; body: Body; params: Params; query: Query }>) {
		if (d.session !== undefined) this.#session = d.session;
		this.#logger = new Logger(this.#id);
		this.#body = d.body;
		this.#params = d.params;
		this.#query = d.query;
		this.#logger.debug("new request business");
	}

	get session(): Session {
		if (this.#session === undefined) throw new BadRequestException400("session undefined");
		else return this.#session;
	}

	get logger(): ILogger {
		return this.#logger;
	}

	get id(): UUID {
		return this.#id;
	}

	get body(): Body {
		return this.#body;
	}

	get params(): Params {
		return this.#params;
	}

	get query(): Query {
		return this.#query;
	}
}

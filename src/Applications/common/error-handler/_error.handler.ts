//import { ZodError } from "zod";
import { BadRequestException400, DomainException, GatewayTimeoutException504, InternalServerException500 } from "#Domain";

import type { UUID } from "node:crypto";
import type { ILogger, IErrorHandler } from "#Domain";

interface Dependencies {
	logger: ILogger;
}

type GetInstance = (d: Dependencies) => Readonly<_ErrorHandler>;

export class _ErrorHandler implements IErrorHandler {
	static #instance?: _ErrorHandler;
	static getInstance: GetInstance = (d) => (this.#instance ??= new _ErrorHandler(d));

	readonly #logger: ILogger;
	private constructor(d: Dependencies) {
		this.#logger = d.logger;
	}

	public readonly catch: IErrorHandler["catch"] = ({ name, error, ticket }) => {
		this.#logger.debug(`💩 ${name}Error - ${ticket}`);
		if (error === undefined) return this.#getInternalServerException(ticket);
		if (!(error instanceof Error)) return this.#unknownThrow(error, ticket);
		if (error instanceof DomainException) return this.#domainExceptionHandler(error, ticket);
		//if (error instanceof ZodError) return this.#zodErrorHandler(error, ticket);
		if (error instanceof Error) return this.#errorHandler(error, ticket);
		return this.#getInternalServerException(ticket);
	};

	readonly #getInternalServerException = (ticket?: UUID): DomainException =>
		new InternalServerException500("Something wrong, please try again latter", { ticket });

	readonly #unknownThrow = (error: unknown, ticket?: UUID): DomainException => {
		this.#logger.warn(`💀 Throw unknown - typeof ${typeof error} 💀`);
		this.#logger.debug("UNKNOWN THROW", error);
		return this.#getInternalServerException(ticket);
	};

	readonly #domainExceptionHandler = (exception: DomainException, ticket?: UUID): DomainException => {
		exception.ticket = ticket;
		this.#logger.debug(`Secure Handled ${exception.name} ${exception.message}.`);
		return exception;
	};

	// readonly #zodErrorHandler = ({ issues }: ZodError, ticket: Ticket): DomainException => {
	// 	const cause = issues.map(({ path, message }) => ({ path: `${path.join(": ")}`, message }));
	// 	this.#logger.debug("Unprocesabble content: ", cause);
	// 	return new UnprocessableException422("Check cause, fix and try again", { ticket, cause });
	// };

	readonly #errorHandler = ({ name, message, stack }: Error, ticket?: UUID): DomainException => {
		if (message.includes("DataSource is not set for this entit")) return new GatewayTimeoutException504("External resource unavailable", { ticket });
		if (name === "FastifyError") return this.#domainExceptionHandler(new BadRequestException400("Fix the request and try again"), ticket);
		this.#logger.debug(`💀 UnhandledError: ${name} ${message} 💀 - ${ticket}`, stack);
		return this.#getInternalServerException(ticket);
	};
}

import { ZodError } from "zod";
import { DEBUG } from "#Config";
import { DomainException, InternalServerException500 } from "../../../Domain/index.ts";

import type { GetHttpMessage, HttpResponse, HttpStatusCode, IResponse, IResponseHandler } from "../../../Domain/index.ts";

interface Dependencies {
	getHttpMessage: GetHttpMessage;
}

export class _ResponseHandler implements IResponseHandler {
	static #instance?: _ResponseHandler;
	static getInstance = (d: Dependencies): _ResponseHandler => (this.#instance ??= new _ResponseHandler(d));

	readonly #getHttpMessage: GetHttpMessage;
	private constructor(d: Dependencies) {
		this.#getHttpMessage = d.getHttpMessage;
	}

	/**
	 * Responses implements
	 * In case of scaling, create a strategy pattern

	public readonly socket: SocketResponse
	public readonly event: EventResponse */
	public readonly http: HttpResponse = ({ code, metadata, pagination, error, data }) => {
		if (error !== undefined) return this.#formatError(error);
		const info = this.#getInfo(code ?? 200);
		return { info, metadata, pagination, data };
	};

	readonly #formatError = (error: unknown): IResponse<never> => {
		if (error instanceof DomainException) return this.#domainErrors(error);
		if (error instanceof ZodError) return this.#unprocessableEntityErrors(error);
		return this.#unhandledError();
	};

	readonly #domainErrors = ({ code, name, message, cause, stack, ticket }: DomainException): IResponse<never> => {
		if (code >= 500) return this.#unhandledError();
		return {
			info: this.#getInfo(code, ticket),
			error: { name, message, cause, stack: this.#getStack(stack) },
		};
	};

	readonly #unprocessableEntityErrors = ({ issues }: ZodError): IResponse<never> => ({
		info: this.#getInfo(422),
		error: {
			name: "UnprocessableEntityError",
			message: "Check cause for issues",
			cause: issues.map(({ path, message }) => `${path.join(" -> ")} ${message}`),
		},
	});

	readonly #unhandledError = (): IResponse<never> => {
		const message = "Ups!. Something went wrong, please try latter";
		const cause = DEBUG ? "Unhandled error response" : undefined;
		const { code, name, stack, ticket } = new InternalServerException500(message, { cause });
		return {
			info: this.#getInfo(code, ticket),
			error: { name, message, cause, stack: this.#getStack(stack) },
		};
	};

	readonly #getInfo = (code: HttpStatusCode, ticket?: string): IResponse<void>["info"] => ({
		success: code < 400,
		code,
		ticket,
		timestamp: Date.now().toString(),
		message: this.#getHttpMessage(code),
	});

	readonly #getStack = (stack?: string): string[] | undefined => {
		if (stack === undefined) return;
		if (!DEBUG) return;
		else return stack.split("\n");
	};
}

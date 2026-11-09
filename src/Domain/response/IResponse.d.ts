import type { DomainException } from "#Domain";
import type { HttpStatus } from "./http-status.enum.js";

export interface IResponse<R> {
	readonly info: Readonly<Info>;
	readonly pagination?: Readonly<Pagination>;
	readonly metadata?: Record<string, unknown>;
	readonly error?: unknown;
	readonly data?: R;
}

type Values<T> = T[keyof T];
export type HttpStatusCode = Values<typeof HttpStatus>;

interface Info {
	code: HttpStatusCode;
	ticket?: DomainException["ticket"];
	message: string;
	success: boolean;
	timestamp: string;
	locale?: string;
}

interface Pagination {
	offset?: number;
	limit?: number;
	cursor?: string;
	next?: string;
	prev?: string;
	total?: number;
}

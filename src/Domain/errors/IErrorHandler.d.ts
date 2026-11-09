import type { DomainException, Ticket } from "./error.factory.ts";

type Catch = (arg: { name: string; error: unknown; ticket: Ticket }) => DomainException;

export interface IErrorHandler {
	catch: Catch;
}

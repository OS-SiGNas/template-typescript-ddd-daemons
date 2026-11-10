import type { UUID } from "node:crypto";
import type { DomainException } from "./error.factory.ts";

type Catch = (arg: { name: string; error: unknown; ticket?: UUID }) => DomainException;

export interface IErrorHandler {
	catch: Catch;
}

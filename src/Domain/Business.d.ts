import type { Core } from "./Core.js";
import type { IErrorHandler } from "./errors/IErrorHandler.js";
import type { IResponseHandler } from "./response/IResponseHandler.js";
import type { IResponse } from "./response/IResponse.js";

export interface ControllersDependencies extends Readonly<Core> {
	readonly responseHandler: IResponseHandler;
	readonly errorHandler: IErrorHandler;
}

export type Controller<Req, Res> = (request: Req) => Promise<Readonly<IResponse<Res>>>;
export type Business<P, R> = (payload: P) => Promise<R>;
export type Parser<P> = (o: object) => Readonly<P>;
export type AsyncParser<P> = (o: object) => Promise<Readonly<P>>;

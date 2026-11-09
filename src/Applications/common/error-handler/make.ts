import { _ErrorHandler } from "./_error.handler.ts";
import { Logger } from "../logger-handler/make.ts";

export const errorHandler = _ErrorHandler.getInstance({
	logger: new Logger("ErrorHandler"),
});

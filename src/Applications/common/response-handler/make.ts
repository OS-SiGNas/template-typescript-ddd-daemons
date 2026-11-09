import { getHttpMessage } from "#Domain";
import { _ResponseHandler } from "./_response.handler.ts";

export const responseHandler = _ResponseHandler.getInstance({ getHttpMessage });

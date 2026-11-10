import { secrets } from "#Config";
import { _GetLogan } from "./_logan.js";
import { _ThreadTransport } from "./transports/_thread.transport.js";

export const Logger = _GetLogan(new _ThreadTransport(secrets.LOGGER_WORKER_FILE));

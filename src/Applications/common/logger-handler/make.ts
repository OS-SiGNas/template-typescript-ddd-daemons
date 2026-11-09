import { secrets } from "#Config";
import { _GetLogan } from "./_logan.ts";
import { _ThreadTransport } from "./transports/_thread.transport.ts";

export const Logger = _GetLogan(new _ThreadTransport(secrets.LOGGER_WORKER_FILE));

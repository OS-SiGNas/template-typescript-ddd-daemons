import type { LogObject } from "../../../Domain/ILogger.js";

export interface Transport {
	exec: (l: LogObject, ...meta: unknown[]) => void;
}

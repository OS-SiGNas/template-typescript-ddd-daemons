import type { Actions } from "./actions.enum.ts";
import type { LogObject } from "../ILogger.js";
import type { IEvent } from "./IEvent.js";
import type { EventEmitter } from "node:events";

export type DomainEventBus = EventEmitter<{
	// system
	[Actions.SYSTEM_BOOT]: [];
	[Actions.SYSTEM_REBOOT]: [];
	[Actions.SYSTEM_SHUTDOWN]: [];
	[Actions.SYSTEM_LOG]: [LogObject, ...meta: unknown[]];

	// Queue
	[Actions.QUEUE_CONSUME]: [IEvent<object>];
	[Actions.QUEUE_PUBLISH]: [IEvent<object>];

	// Notification
	[Actions.NOTICE_BIRTHDAY]: [IEvent<object>];
	[Actions.NOTICE_CHRISMAS]: [IEvent<object>];
	[Actions.NOTICE_NEW_YEAR]: [IEvent<object>];
}>;

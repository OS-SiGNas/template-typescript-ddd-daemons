import type { EventFactory } from "./events/event.factory.ts";
import type { DomainEventBus } from "./events/DomainEventBus.js";
import type { ILogger } from "./ILogger.js";

export interface EventHandler {
	readonly bus: DomainEventBus;
	readonly eventFactory: EventFactory;
}

export interface Core extends EventHandler {
	readonly DEBUG: boolean;
	readonly logger: ILogger;
}

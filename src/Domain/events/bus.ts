import { EventEmitter } from "node:events";
import type { DomainEventBus } from "./DomainEventBus";

/**
 * @description: System event bus
 * @description: 1 - first define a new key in Actions
 * @description: 2 - after define event handler in DomainEventBus interface */
export const bus: DomainEventBus = new EventEmitter();

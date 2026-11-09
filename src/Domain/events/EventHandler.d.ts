import type { Domain } from "domain";
import type { EventFactory } from "./event.factory.ts";

export interface EventHandler {
	bus: Domain;
	eventFactory: EventFactory;
}

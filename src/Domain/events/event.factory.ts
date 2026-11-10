import { secrets } from "#Config";
import { uuidGenerator } from "../../Applications/common/uuid-generator.js";

import type { EventContext, EventMetadata, EventPayload, IEvent } from "../index";

export type EventFactory = <M extends object, C extends EventContext = null>(payload: EventPayload<M, C>) => IEvent<M, C>;
export const eventFactory: EventFactory = ({ metadata: { action, correlationId, moduleEmitter }, context, message }) => {
	const id = uuidGenerator();
	const createdAt = new Date().toISOString();
	const emitter = secrets.APP_NAME;
	const metadata: EventMetadata = {
		action,
		id,
		correlationId,
		createdAt,
		emitter,
		moduleEmitter,
	};

	return { metadata, context, message };
};

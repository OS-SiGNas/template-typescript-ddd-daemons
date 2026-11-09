import type { UUID } from "node:crypto";

export const uuidGenerator = (): UUID => crypto.randomUUID();

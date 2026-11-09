import { describe, it } from "node:test";
import { equal, ok } from "node:assert";

import { Sleep } from "#common/sleep.ts";
import { $try } from "#common/try/$try.ts";
import { $then } from "#common/try/$then.ts";

void describe("Promises with $then and $try", () => {
	type Primitives = Array<string | number | boolean | null | undefined | symbol>;
	const __primitives: Primitives = [undefined, null, "hello world", "", 1, -1, 0, Infinity, NaN, true, false, Symbol(), Symbol("s"), Symbol.for("s")];
	const __objectsMap = new Map<string, unknown>()
		.set("literal", {})
		.set("array", new Array())
		.set("Map", new Map())
		.set("Set", new Set())
		.set("Fn", function Fn() {})
		.set("ArrowFn", () => {});

	const __genericAwaitedFunction = async <R>(payload: R): Promise<R> => {
		if (payload === -1) throw new (class GenericTestError extends Error {})("some error", { cause: payload });
		await Sleep(false)(0.25, "testing delay");
		return Promise.resolve(payload);
	};

	const __debug = (msg: string, error?: unknown): void => console.debug("[DEBUG] * Test: " + msg, error !== undefined ? error : "");
	const __handleResult = (p: unknown, error: Error | null, result: unknown): void => {
		const errorType = error === null ? "null" : typeof error;
		if (error !== null) {
			const condition: boolean = error instanceof Error;
			if (!condition) __debug("unhandled thrown: " + errorType);
			else __debug(`Secure handled ${error.name}: ${error.message} - cause: ${String(error.cause)}`);
			ok(condition);
			return;
		}
		equal(p, result);
	};

	try {
		for (const __p of __primitives) {
			const __type = __p === null ? "null" : typeof __p;
			const __getTestName = (fnName: string): string => `[ ${fnName} ] --> testing primitive ${__type}`;

			void it(__getTestName("$then"), async () => {
				const [error, res] = await $then(__genericAwaitedFunction(__p));
				__handleResult(__p, error, res);
			});

			void it(__getTestName("$try "), async () => {
				const [error, res] = await $try(__genericAwaitedFunction(__p));
				__handleResult(__p, error, res);
			});
		}

		for (const [__name, __p] of __objectsMap) {
			void it("[ $then ] --> testing object: " + __name, async () => {
				const [error, res] = await $then(__genericAwaitedFunction(__p));
				__handleResult(__p, error, res);
			});

			void it("[ $try  ] --> testing object: " + __name, async () => {
				const [error, res] = await $try(__genericAwaitedFunction(__p));
				__handleResult(__p, error, res);
			});
		}
	} catch (error) {
		__debug("\n\n\n             * FATAL_ERROR *\n\n\n", error);
	}
});

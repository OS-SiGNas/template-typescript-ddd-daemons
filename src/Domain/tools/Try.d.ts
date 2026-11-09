/**
 * Solution for awaited and handle errors
 *
 * @type error -> (position 0) Error or null
 * @type result -> (position 1) Awaited function payload
 * @type promise -> any awaited function without "await" word inside brackets only exec function
 * await word must be in left $
 * example:
 *
 * const [error, result] = await $try(anyAwaitedFunction(payload));
 * const [error, result] = await $then(anyAwaitedFunction(payload));
 *
 * return (error !== null)
 *    ? errorHandler.catch(error)
 *    : handleResult(result) */
export type Try = <R>(promise: Promise<R>) => Promise<[Error] | [null, R]>;

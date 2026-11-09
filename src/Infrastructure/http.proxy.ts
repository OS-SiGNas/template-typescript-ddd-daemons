import type { IHttpProxy, Method, Req1, Req2, RequestParams } from "../Domain/IHttpProxy.js";

interface Dependences {
	url?: string;
	mode?: RequestMode;
	cache?: RequestCache;
	credentials?: RequestCredentials;
	headers?: HeadersInit;
	debug: boolean;
}

export class HttpProxy implements IHttpProxy {
	readonly #name = `${this.constructor.name}`;
	readonly #url: string;
	readonly #options: RequestInit;
	readonly #debug: boolean;

	constructor(d: Readonly<Dependences>) {
		this.#debug = d.debug;
		this.#url = d.url ?? "";
		this.#options = {
			credentials: d.credentials ?? "same-origin",
			cache: d.cache ?? "no-cache",
			mode: d.mode ?? "cors",
			headers: d.headers,
		};
	}

	readonly setHeader = (key: string, value: string): this => {
		this.#options.headers = { ...this.#options.headers, [key]: value };
		return this;
	};

	set token(token: string) {
		const headers: HeadersInit = { ...this.#options.headers, Authorization: `Bearer ${token}` };
		this.#options.headers = headers;
	}

	public readonly get: Req1 = async (endpoint) => await this.#request({ method: "GET", endpoint });
	public readonly post: Req2 = async (endpoint, body) => await this.#request({ method: "POST", endpoint, body });
	public readonly put: Req2 = async (endpoint, body) => await this.#request({ method: "PUT", endpoint, body });
	public readonly patch: Req2 = async (endpoint, body) => await this.#request({ method: "PATCH", endpoint, body });
	public readonly del: Req1 = async (endpoint) => await this.#request({ method: "DELETE", endpoint });
	public readonly sendRequest = async <R>(request: RequestParams): Promise<R> => await this.#request<R>(request);

	readonly #request = async <R>({ method, endpoint, body }: RequestParams): Promise<R> => {
		const path = `${this.#url}${endpoint}`;
		const options = await this.#getOptions(method, body);
		if (this.#debug) console.info(`🌎 [${this.#name}]: ${path}`);
		const response = await globalThis.fetch(path, options);
		const contentType = response.headers.get("content-type");
		// TODO: add middlewares implement
		if (contentType !== null && contentType.includes("json")) return await response.json();
		return response as R;
	};

	readonly #getOptions = async (method: Method, body?: object): Promise<Readonly<RequestInit>> => {
		// this.#options.headers["content-type"]  ??= "application/json";
		if (this.#options.headers !== undefined) this.setHeader("content-type", "application/json");
		return await Promise.resolve({ ...this.#options, method, body: JSON.stringify(body) });
	};
}

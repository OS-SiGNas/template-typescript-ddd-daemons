export type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
export interface RequestParams {
	endpoint: string;
	method: Method;
	body?: object;
}

export type Req1 = <R>(endpoint: string) => Promise<R>;
export type Req2 = <R>(endpoint: string, body: object) => Promise<R>;
export interface IHttpProxy {
	sendRequest: <R>(request: RequestParams) => Promise<R>;
	get: Req1;
	post: Req2;
	put: Req2;
	patch: Req2;
	del: Req1;
}

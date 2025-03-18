export type BackendFunction<TArgs, TResult> = (authToken: string, args: TArgs) => Promise<TResult>;

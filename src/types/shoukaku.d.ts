import Atlas from "../modules/client"

interface ShoukakuEvents {
	reconnecting: [name: string, reconnectsLeft: number, reconnectInterval: number]
	debug: [name: string, info: string]
	error: [name: string, error: Error]
	ready: [name: string, reconnected: boolean]
	close: [name: string, code: number, reason: string]
	disconnect: [name: string, count: number]
}

export interface ShoukakuEvent<T extends keyof ShoukakuEvents> {
	name: T,
	cmd: (client: Atlas, ...args: ShoukakuEvents[T]) => void | PromiseLike<void>;
}
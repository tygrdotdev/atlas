import { KazagumoPlayer, KazagumoTrack } from "kazagumo";
import Atlas from "../modules/client"

interface KazagumoEvents {
	playerStart: [player: KazagumoPlayer, track: KazagumoTrack]
	playerEmpty: [player: KazagumoPlayer]
}

export interface KazagumoEvent<T extends keyof KazagumoEvents> {
	name: T,
	cmd: (client: Atlas, ...args: KazagumoEvents[T]) => void | PromiseLike<void>;
}
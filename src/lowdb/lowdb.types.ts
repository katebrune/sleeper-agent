import type { AIMessage } from "src/openai/openai.types"
import type { SleeperPlayer } from "src/sleeper/sleeper.types"

export type Data = {
    messages: MessageWithMetadata[]
    players: {[key: string]: SleeperPlayer}
}

export type MessageWithMetadata = AIMessage & {
    id: string
    createdAt: string
}
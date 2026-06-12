import type { HistoryTurn, InferenceStats, PromptProcessingInProgressStats, ToolCallSpec, ToolTurn, UiHistoryTurn, UiHistoryTurnType } from "@agent-smith/types";
import { state, uistate } from "../state.js";

const useUiHistory = () => {
    const newTurn = (type: UiHistoryTurnType, from: string, n: number, ht?: HistoryTurn) => {
        //console.log("NEW TURN", state.uihistory.length + 1, from, type, ht);
        let turn: UiHistoryTurn = {
            from: type == "user" ? "user" : from,
            type: type,
            agentTurn: n,
            state: {
                showThinking: false,
                showToolResponses: [],
                confirmRestartAtTurn: null,
                confirmToolCalls: {},
            },
        };
        if (ht) {
            turn = { ...turn, ...ht }
        }
        state.uihistory.push(turn)
    }

    const _currentTurn = (): UiHistoryTurn => {
        return state.uihistory[state.uihistory.length - 1];
    }

    const addStatsToCurrentTurn = (s: InferenceStats) => {
        const ct = _currentTurn();
        ct.stats = s;
    }

    const addPrefillStatsToCurrentTurn = (s: PromptProcessingInProgressStats) => {
        const ct = _currentTurn();
        ct.prefillStats = s
    }

    const addToolCallToCurrentTurn = (tt: ToolTurn) => {
        const ct = _currentTurn();
        if (!ct?.tools) {
            ct.tools = []
        }
        ct.tools.push(tt)
    }

    const addToolResponseToCurrentTurn = (tc: ToolCallSpec, tr: any, from: string) => {
        let tindex: number | null = null;
        let i = 0;
        const ct = _currentTurn();
        if (!ct?.tools) {
            throw new Error(`${from} addToolResponseToCurrentTurn: no tools in current turn: ${tc.name} ${tr}`,)
        }
        for (const t of ct.tools) {
            //console.log("TR", t.call.id == id, t.call.id, id)
            if (t.call.id == tc.id) {
                tindex = i;
                break
            };
            ++i
        }
        if (tindex === null) {
            throw new Error(`${from} addToolResponseToCurrentTurn: tool call id ${tc.id} not found in current turn:\n ${JSON.stringify(ct, null, 2)}`)
        }
        ct.tools[tindex].response = tr;
    }

    const reset = () => {
        state.uihistory = [];
    }

    return {
        get currentTurn() {
            return state.uihistory[state.uihistory.length - 1];
        },
        newTurn,
        addToolCallToCurrentTurn,
        addPrefillStatsToCurrentTurn,
        addToolResponseToCurrentTurn,
        addStatsToCurrentTurn,
        reset,
    }
}

export {
    useUiHistory,
}
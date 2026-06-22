import type { HistoryTurn, InferenceStats, PromptProcessingInProgressStats, ToolCallSpec, ToolTurn, UiHistoryTurn, UiHistoryTurnType } from "@agent-smith/types";
import { state } from "../state.js";

const useUiHistory = () => {
    const newTurn = (_type: UiHistoryTurnType, from: string, n: number, ht?: HistoryTurn) => {
        //console.log("NEW TURN", state.uihistory.length, from, _type, JSON.stringify(ht, null, 2));
        const turn: UiHistoryTurn = {
            from: _type == "user" ? "user" : from,
            type: _type,
            agentTurn: n,
            state: {
                showThinking: false,
                showToolResponses: [],
                confirmRestartAtTurn: null,
                confirmToolCalls: {},
            },
        };
        //console.log("TURN A", turn.type);
        if (ht) {
            if (ht?.user) {
                turn.user = ht.user;
            }
            if (ht?.think) {
                turn.think = ht.think;
            }
            if (ht?.assistant) {
                turn.assistant = ht.assistant;
            }
            if (ht?.tools) {
                turn.tools = ht.tools;
            }
            if (ht?.images) {
                turn.images = ht.images;
            }
        }
        //console.log("TURN B", turn.type);
        //console.log("HT", ht);
        //console.log("===== HIST 1", JSON.stringify(state.uihistory, null, 2), "\n===========")
        state.uihistory.push(turn);
        //console.log("===== HIST 2", JSON.stringify(state.uihistory, null, 2), "\n===========")
        //console.log("HCT", JSON.stringify(_currentTurn(), null, 2));
    }

    const _currentTurn = (): UiHistoryTurn => {
        return state.uihistory[state.uihistory.length - 1];
    }

    const addStatsToCurrentTurn = (s: InferenceStats) => {
        const ct = _currentTurn();
        //console.log("ST", JSON.stringify(ct, null, 2))
        state.uihistory[state.uihistory.length - 1].stats = s;
        //console.log("===== HIST STATS", JSON.stringify(state.uihistory, null, 2), "\n===========")
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
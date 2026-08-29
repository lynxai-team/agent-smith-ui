import type { HistoryTurn, InferenceStats, ToolCallSpec, UiHistoryTurnType } from "@agent-smith/types";
import type { AgentUiHistoryTurn, UiToolTurn } from "../interfaces.js";
import { reactive } from "vue";

interface SubCtx {
    callerFrom: string;   // agent that issued the run-agent call
    subName: string;      // subagent name (event `from` of the child)
    tcId: string;         // tool call id of the run-agent call
    history: AgentUiHistoryTurn[];
}

const isAgentTool = (tt: UiToolTurn) => tt.type == "agent" || tt.call.name == "run-agent";
const subAgentName = (tt: UiToolTurn): string =>
    (tt.call.arguments as Record<string, any>)?.name ?? tt.call.name;

const useAgentHistory = () => {
    const mainAgent = reactive<{ history: AgentUiHistoryTurn[] }>({ history: [] });
    let openSubs: SubCtx[] = [];

    // Route an agent name to its turn bucket: innermost open subagent context wins,
    // otherwise the main history.
    const route = (from: string): AgentUiHistoryTurn[] => {
        for (let i = openSubs.length - 1; i >= 0; --i) {
            if (openSubs[i].subName == from) return openSubs[i].history;
        }
        return mainAgent.history;
    };

    const lastTurn = (from: string): AgentUiHistoryTurn | undefined => {
        const b = route(from);
        return b[b.length - 1];
    };

    const newTurn = (_type: UiHistoryTurnType, from: string, ht?: HistoryTurn) => {
        const bucket = route(from);
        const turn: AgentUiHistoryTurn = {
            from: _type == "user" ? "user" : from,
            type: _type,
            agentTurn: bucket.length,   // per-agent numbering (no shared state.history)
            state: {
                showThinking: false,
                showToolResponses: [],
                confirmRestartAtTurn: null,
                confirmToolCalls: {},
            },
        };
        if (ht) {
            if (ht?.stats) turn.stats = ht.stats;
            if (ht?.user) turn.user = ht.user;
            if (ht?.think) turn.think = ht.think;
            if (ht?.assistant) turn.assistant = ht.assistant;
            if (ht?.images) turn.images = ht.images;
        }
        bucket.push(turn);
    };

    const addToolCallToCurrentTurn = (from: string, tt: UiToolTurn) => {
        if (!lastTurn(from)) {
            newTurn("tools", from);   // defensive: tool call before any turn for this agent
        }
        const ct = lastTurn(from)!;
        if (!ct.tools) ct.tools = [];
        ct.tools.push(tt);
        if (isAgentTool(tt)) {
            openSubs.push({ callerFrom: from, subName: subAgentName(tt), tcId: tt.call.id, history: [] });
        }
    };

    const addToolResponseToCurrentTurn = (tc: ToolCallSpec, tr: any, from: string) => {
        const ctx = openSubs.find(c => c.tcId == tc.id);
        if (ctx) {
            // agent-type call: set response on the caller's ToolTurn and attach child history
            const cb = route(ctx.callerFrom);
            const ct = cb[cb.length - 1];
            const t = ct?.tools?.find(t => t.call.id == tc.id);
            if (!t) {
                throw new Error(`${ctx.subName} addToolResponseToCurrentTurn: tool call ${tc.id} not found in caller turn`);
            }
            t.response = tr;
            t.subHistory = ctx.history;
            openSubs = openSubs.filter(c => c != ctx);
        } else {
            const ct = lastTurn(from);
            if (!ct?.tools) {
                // confirmed tool call: ToolTurn was only registered in uihistoryManager — create it here
                if (!ct) newTurn("tools", from);
                const c2 = lastTurn(from)!;
                if (!c2.tools) c2.tools = [];
                c2.tools.push({ from, type: "", call: tc, response: tr });
                return;
            }
            const t = ct.tools.find(t => t.call.id == tc.id);
            if (!t) {
                throw new Error(`${from} addToolResponseToCurrentTurn: tool call id ${tc.id} not found in current turn`);
            }
            t.response = tr;
        }
    };

    const addStatsToCurrentTurn = (s: InferenceStats, from: string) => {
        const ct = lastTurn(from);
        if (ct) ct.stats = s;
    };

    const reset = () => {
        mainAgent.history = [];
        openSubs = [];
    };

    return {
        mainAgent,
        newTurn,
        addToolCallToCurrentTurn,
        addToolResponseToCurrentTurn,
        addStatsToCurrentTurn,
        reset,
    };
}

export { useAgentHistory };

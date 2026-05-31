import type { AgentInferenceOptions, ClientFeaturesOptions, HistoryTurn, PromptProcessingInProgressStats, ToolCallSpec, ToolTurn } from "@agent-smith/types";
import { getMarkdown, parseMarkdownToStructure } from "markstream-vue";
import { nextTick, toRaw, type Reactive, type Ref } from "vue";
import type { ParsedNode } from "yaml";
import { uihistoryManager, state, uistate } from "../state.js";
import { createAwaiter } from "../utils.js";
import { msg } from "./notify.js";

let parseScheduled = false;

const useTaskEvents = (
    stream: Ref<string>,
    scrollOutput: CallableFunction,
    nodes: Ref<ParsedNode[]>,
    thinkingNodes: Ref<ParsedNode[]>,
    toolCallsState: Reactive<{ tcs: Array<ToolCallSpec>, from: string }>,
    hasThinking: Ref<boolean>,
    currentAgent: Ref<string>,
): { events: ClientFeaturesOptions, resetStream: () => void } => {
    //let prevToken = "";
    let buffer = "";
    const md = getMarkdown();
    //const perf = useInferencePerfTimer();
    const debug = false;
    let callerAgents = new Array<string>();
    //let currentStats: InferenceStats | null = null;

    const onTurnStart: AgentInferenceOptions["onTurnStart"] = (from: string) => {
        if (debug) {
            console.log("TURN START", from);
        }
        currentAgent.value = from;
    }

    const onStartEmit: AgentInferenceOptions["onStartEmit"] = (progress: PromptProcessingInProgressStats, from: string) => {
        if (debug) {
            console.log("START EMIT", from, progress);
        }
        if (state.isLoadingModel) {
            state.isLoadingModel = false;
        }
        state.isProcessingPrompt = false;
        state.promptProcessingProgress = {
            total: 0,
            cache: 0,
            processed: 0,
            time_ms: 0,
            percent_progress: 0,
            percent_cache: 0,
            time_humanized: "",
            tps: 0
        }
        //history.addPrefillStatsToCurrentTurn(progress)
    }

    const onToolCallInProgress: AgentInferenceOptions["onToolCallInProgress"] = (tcs: Array<ToolCallSpec>, from: string) => {
        if (debug) { console.log("TCIP", from, tcs) }
        toolCallsState.tcs = tcs;
        toolCallsState.from = from;
        scrollOutput(true, 25);
    }

    const onToolsTurnStart: AgentInferenceOptions["onToolsTurnStart"] = (tcs: Array<ToolCallSpec>, from: string) => {
        if (debug) { console.log("TOOLS TURN START", from) }
        // create a new turn
        uihistoryManager.newTurn("tools", from, state.history.length - 1);
        stream.value = "";
    }

    const onToolsTurnEnd: AgentInferenceOptions["onToolsTurnEnd"] = (tt: Array<ToolTurn>, from: string) => {
        if (debug) { console.log("TOOLS TURN END", from, tt) }
        toolCallsState.tcs = [];
        toolCallsState.from = "";
    }

    const onThinkingToken: AgentInferenceOptions["onThinkingToken"] = (t: string, from: string) => {
        buffer += t;
        // @ts-ignore
        thinkingNodes.value = parseMarkdownToStructure(buffer, md, {
            final: true,
            //requireClosingStrong: true,
        });
        stream.value += t;
        scrollOutput();
    }

    const onStartThinking: AgentInferenceOptions["onStartThinking"] = (from: string) => {
        if (debug) { console.log("START THINKING", from) };
        hasThinking.value = true;
    }

    const onEndThinking: AgentInferenceOptions["onEndThinking"] = (from: string) => {
        if (debug) { console.log("ON THINKING END", from) };
        hasThinking.value = false;
        uihistoryManager.newTurn("think", from, state.history.length - 1, {
            think: stream.value,
        });
        buffer = "";
        stream.value = "";
        //console.log("END T")
    }

    const onToken: AgentInferenceOptions["onToken"] = (chunk: string, from: string) => {
        buffer += chunk;
        stream.value += chunk;
        if (!parseScheduled) {
            parseScheduled = true;
            requestAnimationFrame(() => {
                // @ts-ignore
                nodes.value = parseMarkdownToStructure(buffer, md, { final: true });
                parseScheduled = false;
                nextTick(() => scrollOutput())
            });
        }
    }

    const onToolCall: AgentInferenceOptions["onToolCall"] = (tc: ToolCallSpec, type: string, from: string) => {
        if (debug) { console.log("TOOL CALL", "from=" + from, "type=" + type, tc); }
        const t: ToolTurn = {
            from: from,
            type: type,
            call: { id: tc.id, name: tc.name, arguments: tc.arguments },
            response: null,
        };
        uihistoryManager.addToolCallToCurrentTurn(t);
        const tcip = toolCallsState.tcs.findIndex(a => a.id == tc.id);
        if (tcip === -1) {
            throw new Error(`tool call in progress ${tc} not found`)
        }
        toolCallsState.tcs.splice(tcip, 1);
        if (type == "agent") {
            console.log("SET CA onToolCall", tc.name, currentAgent.value, "=>", from);
            currentAgent.value = tc.name;
            callerAgents.push(from);
        }
        // auto open last tool call in history
        if (uistate.value.autoOpenTools) {
            //console.log("AOT", history.currentTurn.state.showToolResponses);
            if (uihistoryManager.currentTurn?.tools) {
                uihistoryManager.currentTurn.state.showToolResponses.push(
                    uihistoryManager.currentTurn.tools[uihistoryManager.currentTurn.tools.length - 1].call.id
                )
            }
            //console.log("AOT END", history.currentTurn.state.showToolResponses);
        }
        scrollOutput();
    };

    const onToolCallEnd: AgentInferenceOptions["onToolCallEnd"] = (
        tc: ToolCallSpec, tr: any, type: string, from: string) => {
        if (debug) {
            console.log("END TOOL CALL", tc.name, type, from, ":", tr);
        }
        if (type == "agent") {
            //history.newTurn("assistant", from, { assistant: tr });
            const ca = callerAgents.pop();
            if (!ca) {
                throw new Error(`onToolCallEnd: ${from}, caller agent not found: callerAgents: ${callerAgents}`)
            }
            //console.log("SET CA onToolCallEnd", tc.name, currentAgent.value, "=>", ca);
            //currentAgent.value = ca;
        } else {
            uihistoryManager.addToolResponseToCurrentTurn(tc, tr, from)
        }
        stream.value = "";
        scrollOutput(true, 50);
    };

    const confirmToolUsage: AgentInferenceOptions["confirmToolUsage"] = async (tc: ToolCallSpec, from: string) => {
        const { awaiter, unblock } = createAwaiter<boolean>();
        let turn = state.uihistory[state.uihistory.length - 1];
        //console.log("HIST", toRaw(state.uihistory), null, 2);
        if (!turn?.tools) {
            turn.tools = []
        }
        const t = {
            from: from,
            type: "",
            call: { id: tc.id, name: tc.name, arguments: tc.arguments },
            response: null,
            order: []
        };
        //console.log("ADD TOOL TO CURRENT TURN FROM CONFIRM", t);
        turn.tools.push(t)
        //console.log("TT", JSON.stringify(toRaw(turn), null, 2));
        turn.state.confirmToolCalls[tc.id] = { resolve: unblock, reject: () => true };
        const res = await awaiter;
        delete turn.state.confirmToolCalls[tc.id];
        turn.state.showToolResponses = []
        return res
        //console.log("CONFIRM TOOL", tc); return confirm(`Use tool \n${JSON.stringify(tc)} ?`)
    };

    const onAssistant: AgentInferenceOptions["onAssistant"] = (txt: string, from: string) => {
        if (debug) { console.log("ASSISTANT", from, txt); }
        uihistoryManager.newTurn("assistant", from, state.history.length - 1, {
            assistant: txt,
        });
        nextTick(async () => { stream.value = ""; });
        scrollOutput(true, 100)
    };

    const onThink: AgentInferenceOptions["onThink"] = (txt: string, from: string) => {
        if (debug) { console.log("ON THINK", from, txt); }
        nextTick(async () => { stream.value = ""; });
        scrollOutput(true, 100)
    };

    const onTurnEnd: AgentInferenceOptions["onTurnEnd"] = (ht: HistoryTurn, from: string) => {
        if (debug) {
            console.log("END TURN", from, "/", currentAgent.value, "/", state.currentFeature.name, ht);
        };
        if (from == state.currentFeature.name) {
            if (state.history.length > 0) {
                // user always has the first turn
                if (ht?.user) {
                    delete ht.user
                }
            }
            state.history.push(ht);
            if (ht?.stats && !(from == "server")) {
                uihistoryManager.addStatsToCurrentTurn(ht.stats)
            }
        }
        stream.value = "";
        nodes.value = [];
        thinkingNodes.value = [];
        buffer = "";
        scrollOutput(true, 100);
    }

    /*const onEndEmit: AgentInferenceOptions["onEndEmit"] = (res: InferenceResult, from: string) => {
        if (debug) { console.log("*********** END EMIT", from, res); };
        currentStats = convertStats(res.stats);
    }*/

    const onToolCallToken = (t: string, from: string) => {
        //console.log("TCT", t)
        stream.value += t;
        scrollOutput();
    }

    const onPromptProcessingProgress = (progress: PromptProcessingInProgressStats, from: string) => {
        if (debug) {
            console.log("PPP", progress)
        }
        if (state.isLoadingModel) {
            state.isLoadingModel = false;
        }
        if (progress.percent_progress == 100) {
            state.isProcessingPrompt = false;
            state.promptProcessingProgress = {
                total: 0,
                cache: 0,
                processed: 0,
                time_ms: 0,
                percent_progress: 0,
                percent_cache: 0,
                time_humanized: "",
                tps: 0
            }
        } else {
            state.isProcessingPrompt = true;
            state.promptProcessingProgress = progress;
        }
        scrollOutput(true, 50);

    }

    const onError: AgentInferenceOptions["onError"] = (err: any, from: string) => {
        console.error(from, err);
        msg.error(`Error running ${from}`, `${err}`)
    }

    const resetStream = () => {
        buffer = "";
        nodes.value = [];
        thinkingNodes.value = [];
        stream.value = "";
        toolCallsState.from = "";
        toolCallsState.tcs = [];
        hasThinking.value = false;
        state.isLoadingModel = false;
        state.isProcessingPrompt = false;
        state.promptProcessingProgress = {
            total: 0,
            cache: 0,
            processed: 0,
            time_ms: 0,
            percent_progress: 0,
            percent_cache: 0,
            time_humanized: "",
            tps: 0
        };
        callerAgents = []
    }

    return {
        events: {
            onToken,
            onThinkingToken,
            onStartThinking,
            onEndThinking,
            onToolCall,
            onToolCallEnd,
            confirmToolUsage,
            onToolsTurnStart,
            onToolsTurnEnd,
            onTurnStart,
            onTurnEnd,
            onAssistant,
            onThink,
            onToolCallInProgress,
            onPromptProcessingProgress,
            onToolCallToken,
            onError,
            onStartEmit,
        },
        resetStream,
    }
}

export {
    useTaskEvents
};

import type { AgentState, ConfigFile, HistoryTurn, SamplingPreset, UiHistoryTurn, Workspace } from "@agent-smith/types";
import { useClientFeatures } from "@agent-smith/wscli";
import { User } from "@snowind/state";
import { useStorage } from '@vueuse/core';
import { reactive, ref, shallowRef } from "vue";
import type { SidebarType, UiTaskView } from "./interfaces.js";
import { useUiHistory } from "./services/history.js";
import { createAwaiter } from "./utils.js";

const debugInference = ref(true);
const uihistoryManager = useUiHistory();
const user = new User();
const theme = ref("bluestar");
const appSidebar = shallowRef();
const uistate = useStorage<{
    sidebar: SidebarType,
    taskView: UiTaskView,
    autoscroll: boolean,
    autoOpenThink: boolean,
    autoOpenTools: boolean,
    viewMode: "text" | "markdown" | "raw",
    title: string,
    backend: string,
}>('uistate', {
    sidebar: "agents",
    taskView: "view",
    autoscroll: true,
    autoOpenThink: false,
    autoOpenTools: false,
    viewMode: "markdown",
    title: "",
    backend: "",
});
const { awaiter, unblock } = createAwaiter<boolean>();
const state = reactive<AgentState>({
    isReady: false,
    isLoadingModel: false,
    isProcessingPrompt: false,
    onReady: awaiter,
    promptProcessingProgress: {
        total: 0,
        cache: 0,
        processed: 0,
        time_ms: 0,
        percent_progress: 0,
        percent_cache: 0,
        time_humanized: "",
    },
    hasConfig: false,
    uihistory: new Array<UiHistoryTurn>(),
    history: new Array<HistoryTurn>,
    models: {},
    agentsSettings: {} as Record<string, Record<string, any>>,
    backends: {},
    currentFeature: reactive<{ name: string, type: string }>({ name: "", type: "none" }),
    currentWorkspace: { name: "", path: "", props: {} },
    currentModel: { id: "", status: "", ctx: 0, hasVision: false },
    workspaces: {},
    settings: {},
    samplingPresets: {},
});
const conf = ref<ConfigFile>();
const srv = useClientFeatures();

async function initState() {
    const { found, config } = await srv.checkState();
    state.hasConfig = found;
    if (found) {
        conf.value = config
    }
    const lm = async () => {
        if (conf.value?.backends) {
            for (const k of Object.keys(conf.value.backends)) {
                if (k == "default") {
                    continue
                }
                try {
                    const bks = await srv.loadModels(k);
                    state.models[k] = bks;
                } catch (e) {
                    console.error(`Can not load models from ${k}`, `Check you backend server`)
                    //throw new Error("can not load models")
                }
            }
        }
    }
    //console.log("CONF", conf.value)
    //console.log("SRV STATE", state);
    if (state.hasConfig) {
        //console.log("Init td");
        await initTaskData();
        //console.log("run lm");
        state.isReady = true;
        unblock(true)
        lm();
    } else {
        state.isReady = true;
        unblock(true)
    }
}

async function initTaskData() {
    let ts: Record<string, Record<string, any>>;
    let bk: Record<string, any>;
    let ws: Workspace[];
    let st: Record<string, any>;
    let mp: Record<string, SamplingPreset>;
    try {
        [ts, bk, ws, st, mp] = await Promise.all([
            srv.loadAgentSettings(),
            srv.loadBackends(),
            srv.loadWorkspaces(),
            srv.loadSettings(),
            srv.loadSamplingPresets(),
        ]);

    } catch (e) {
        throw new Error(`initialization: ${e}`)
    }
    const wss: Record<string, Workspace> = {};
    ws.forEach(w => wss[w.name] = w);
    state.workspaces = wss;
    state.settings = st;
    //console.log("Settings", st);
    if (state.settings?.workspace) {
        state.currentWorkspace = wss[state.settings.workspace]
    }
    //console.log("WS", ws);
    state.agentsSettings = ts;
    state.backends = bk;
    for (const v of Object.values(bk)) {
        if (v.isDefault) {
            uistate.value.backend = v.name;
            break
        }
    }
    state.samplingPresets = mp;
}

function resetCurrentFeature() {
    state.currentFeature.type = "none";
    state.currentFeature.name = "none";
    state.history = [];
}

function setCurrentFeature(name: string, type: string) {
    state.currentFeature.type = type;
    state.currentFeature.name = name;
}

export {
    appSidebar, conf, debugInference, uihistoryManager, initState,
    resetCurrentFeature,
    setCurrentFeature, srv, state,
    theme, uistate, user
};


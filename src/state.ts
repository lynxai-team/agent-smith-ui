import { User } from "@snowind/state";
import { reactive, ref, shallowRef } from "vue";
import type { SidebarType, UiTaskView } from "./interfaces.js";
import { useClientFeatures } from "@agent-smith/wscli";
import { useStorage } from '@vueuse/core';
import { createAwaiter } from "./utils.js";
import type { ModelInfo, UiHistoryTurn, ConfigFile, Workspace, HistoryTurn, AgentState, SamplingPreset } from "@agent-smith/types";
import { msg } from "./services/notify.js";
import { useUiHistory } from "./services/history.js";

const debugInference = ref(true);
const history = useUiHistory();
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
    models: {} as Record<string, ModelInfo>,
    agentsSettings: {} as Record<string, Record<string, any>>,
    backends: {} as Record<string, Record<string, any>>,
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
    //console.log("CONF", conf.value)
    //console.log("SRV STATE", state);
    if (state.hasConfig) {
        await initTaskData()
    }
    state.isReady = true;
    //console.log("TS", state.tasksSettings)
    unblock(true)
}

async function initTaskData() {
    const lm = async () => {
        try {
            return await srv.loadModels();
            //console.log("SMOD", state.models)
        } catch (e) {
            msg.error("Can not load models", "Check you backend server")
            //throw new Error("can not load models")
        }
    }
    let ts: Record<string, Record<string, any>>;
    let bk: Record<string, any>;
    let ws: Workspace[];
    let st: Record<string, any>;
    let mp: Record<string, SamplingPreset>;
    let mo: Record<string, ModelInfo> | undefined = {};
    try {
        [mo, ts, bk, ws, st, mp] = await Promise.all([
            lm(),
            srv.loadAgentSettings(),
            srv.loadBackends(),
            srv.loadWorkspaces(),
            srv.loadSettings(),
            srv.loadSamplingPresets(),
        ]);

    } catch (e) {
        throw new Error(`initialization: ${e}`)
    }
    state.models = mo ?? {};
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
    initState,
    resetCurrentFeature,
    setCurrentFeature,
    history,
    state,
    theme,
    user,
    uistate,
    debugInference,
    conf,
    appSidebar,
    srv,
};


import type { AgentState, ConfigFile, HistoryTurn, InferenceBackend, SamplingPreset, UiHistoryTurn, Workspace } from "@agent-smith/types";
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
    availableAgents: Record<string, boolean>,
    inferenceSidebar: "none" | "full" | "mini",
    inferenceSidebarName: string,
    theme: string,
}>('uistate', {
    sidebar: "agents",
    taskView: "view",
    autoscroll: true,
    autoOpenThink: false,
    autoOpenTools: false,
    viewMode: "markdown",
    title: "",
    backend: "",
    availableAgents: {},
    inferenceSidebar: "none",
    inferenceSidebarName: "sampling",
    theme: "stone"
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
        tps: 0,
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
    //state.onReady.then(() => console.log("state ready"))
    setTheme();
    const { found, config } = await srv.checkState();
    state.hasConfig = found;
    //console.log("CONF", config)
    if (found) {
        conf.value = config
    }
    if (state.hasConfig) {
        await initTaskData();
        state.isReady = true;
        unblock(true)
    } else {
        state.isReady = true;
        unblock(true)
    }
}

async function initTaskData() {
    let ts: Record<string, Record<string, any>>;
    let ws: Workspace[];
    let st: Record<string, any>;
    let mp: Record<string, SamplingPreset>;
    srv.loadBackends().then((bk) => {
        state.backends = bk;
        for (const v of Object.values(bk)) {
            if (v.isDefault) {
                uistate.value.backend = v.name;
                break
            }
        }
        if (conf.value?.backends) {
            for (const [k, v] of Object.entries(conf.value.backends)) {
                if (k == "default") {
                    continue
                }
                try {
                    const b = v as InferenceBackend;
                    const loadModels = b?.type !== "openai" ? true : false;
                    //console.log("Load models", v, loadModels)
                    if (loadModels) {
                        srv.loadModels(k).then(bks => state.models[k] = bks);
                    }
                } catch (e) {
                    console.error(`Can not load models from ${k}`, `Check you backend server`)
                    //throw new Error("can not load models")
                }
            }
        }
    });
    try {
        [ts, ws, st, mp] = await Promise.all([
            srv.loadAgentSettings(),
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


function setTheme(t?: string) {
    const currentTheme = uistate.value.theme;
    uistate.value.theme = t ?? currentTheme;
    const th = document.getElementsByTagName("html")[0];
    //console.log("Current theme", currentTheme);
    //console.log("Switching to theme:", store.value.theme);
    th?.classList.remove("theme-" + currentTheme);
    th?.classList.add("theme-" + uistate.value.theme);
}

export {
    appSidebar, conf, debugInference, uihistoryManager, initState,
    resetCurrentFeature,
    setCurrentFeature, srv, state,
    uistate, user, setTheme
};


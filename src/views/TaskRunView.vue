<template>
  <div class="flex flex-row w-fit">
    <div id="main-output" class="flex flex-col flex-grow w-full h-max overflow-y-auto">
      <div class="w-full flex flex-col h-max overflow-y-auto p-3">
        <template v-if="state.uihistory.length > 0">
          <div v-for="(turn, i) in state.uihistory" class="flex flex-col">
            <TurnTitle name="user" v-if="i == 0"></TurnTitle>
            <TurnTitle :name="turn.from" v-else-if="state.uihistory[i - 1].from != turn.from" class="pt-3"></TurnTitle>
            <div v-if="turn?.user" class="hover:background rounded-md px-3 flex flex-row items-end w-full"
              :class="confirmRestart !== null ? 'visible' : 'border invisible hover:visible'">
              <template v-if="confirmRestart != i">
                <div class="flex-grow visible p-3">
                  <!-- MarkdownRender :content="turn.user" v-if="uistate.viewMode == 'markdown'" / -->
                  <div class="txt-semilight" v-html="turn.user.replaceAll('\n', '<br />')"></div>
                </div>
                <button class="btn txt-success hover:success mb-2 flex flex-row items-center space-x-2"
                  @click="confirmRestart = i">
                  <UserEditIcon width="24" height="24"></UserEditIcon>
                  <div class="text-sm">Restart&nbsp;here</div>
                </button>
              </template>
              <template v-else>
                <div class="flex-grow visible p-3 pl-0 flex flex-col space-y-3">
                  <!-- MarkdownRender :content="turn.user" v-if="uistate.viewMode == 'markdown'" / -->
                  <div class="txt-semilight" v-html="turn.user.replaceAll('\n', '<br />')"></div>
                </div>
                <button class="btn success text-sm py-0 mr-2" @click="confirmRestart = null">Cancel</button>
                <button class="btn warning text-sm py-0 flex flex-row space-x-2 items-center" @click="restartAtTurn(i)">
                  <UserEditIcon width="24" height="24"></UserEditIcon>
                  <div>Restart at turn {{ i + 1 }}?</div>
                </button>
              </template>
            </div>
            <div v-if="turn?.prefillStats" class="pl-3">
              <PromptProcessingProgress v-if="turn.prefillStats.total > 0" :prompt-processing-stats="turn.prefillStats">
              </PromptProcessingProgress>
            </div>
            <div v-if="turn?.think" class="pb-2 px-2">
              <ThinkingContent :content="turn.think" :from="turn.from"></ThinkingContent>
            </div>
            <div v-if="turn?.assistant" class="px-3 pb-3 flex flex-col space-y-3">
              <MarkdownRender v-if="uistate.viewMode == 'markdown'" :content="turn.assistant" class="mdr" />
              <div v-else-if="uistate.viewMode == 'text'" v-html="turn.assistant.replaceAll('\n', '<br />')"></div>
              <div v-else>
                <pre>{{ turn.assistant }}</pre>
              </div>
            </div>
            <div v-if="turn?.tools" class="flex flex-col">
              <div v-for="tool in turn.tools" class="flex flex-col px-3">
                <FormatedToolCall :tool="tool" :turn="turn" class="cursor-pointer"
                  :class="i == (turn.tools.length - 1) ? 'mb-1' : 'mb-3'"
                  @click="toggleViewToolResult(tool.call.id, turn)">
                </FormatedToolCall>
                <div v-if="tool.call.id in turn.state.confirmToolCalls" class="flex flex-row space-x-2">
                  <button class="btn danger text-sm"
                    @click="turn.state.confirmToolCalls[tool.call.id].resolve(false)">Deny</button>
                  <button class="btn success text-sm"
                    @click="turn.state.confirmToolCalls[tool.call.id].resolve(true)">Authorize</button>
                </div>
                <div class="toolcall overflow-y-auto slide-y" :class="turn.state.showToolResponses.includes(tool.call.id) ? [
                  ['slidedown']
                ] : 'slideup'">
                  <ToolCallDetails :tool="tool" class="mt-2 ml-3"></ToolCallDetails>
                </div>
              </div>
            </div>
            <div v-if="turn?.stats" class="px-3 my-2">
              <HistoryTurnStatsBar :stats="turn.stats"></HistoryTurnStatsBar>
            </div>
          </div>
        </template>
        <div v-if="state.isLoadingModel" class="pl-6 txt-semilight">
          Loading {{ state.currentModel.id }} model ...
        </div>
        <div v-if="state.isProcessingPrompt" class="pb-3 pl-3">
          <PromptProcessingProgress :prompt-processing-stats="state.promptProcessingProgress">
          </PromptProcessingProgress>
        </div>
        <div v-if="stream.length > 0" class="flex-grow">
          <TurnTitle :name="currentAgent" v-if="state.uihistory[state.uihistory.length - 1].from != currentAgent"
            class="pt-3">
          </TurnTitle>
          <template v-if="hasThinking">
            <ThinkingNode :nodes="thinkingNodes" custom-id="think" :is-strict="true" :from="currentAgent" class="pl-3">
            </ThinkingNode>
          </template>
          <template v-else>
            <MarkdownRender v-if="uistate.viewMode == 'markdown'" :nodes="nodes" custom-id="main" :is-strict="true"
              class="pl-3 mdr" />
            <div v-else-if="uistate.viewMode == 'text'" v-html="stream.replaceAll('\n', '<br />')" class="pl-3"></div>
            <div v-else class="pl-3">
              <pre>{{ stream }}</pre>
            </div>
          </template>
        </div>
        <div v-if="toolCallsState.tcs.length > 0" class="flex flex-col pt-2 pl-4">
          <div v-for="tc in toolCallsState.tcs" class="pb-2">
            <FormatedToolCallInProgress :from="toolCallsState.from" :tool-call-spec="tc" :stream="stream">
            </FormatedToolCallInProgress>
          </div>
        </div>
        <a id="bottom-output" class="mt-3"></a>
      </div>
      <div id="prompt-input" class="px-3 pb-5 flex flex-col fixed bottom-0 left-[16.666667%] z-20">
        <div class="flex flex-wrap gap-3 w-full mb-3" v-if="srv.isReady">
          <div v-for="(v, k) in srv.variables?.required" class="w-[49%] success">
            <IftaLabel v-if="k != 'workspace'">
              <InputText :id="k" v-model="srv.variables.values.required[k]" variant="filled" class="w-full" />
              <label :for="k">{{ v.description }}</label>
            </IftaLabel>
          </div>
          <div v-for="(v, k) in srv.variables?.optional" class="w-[49%] success">
            <IftaLabel v-if="k != 'workspace'">
              <InputText :id="k" v-model="srv.variables.values.optional[k]" variant="filled" class="w-full" />
              <label :for="k">{{ v.description }}</label>
            </IftaLabel>
          </div>
          <div v-for="(v, k) in srv?.mcp.servers" class="w-[49%] success">
            <IftaLabel v-if="k != 'workspace'">
              <InputText :id="k" v-model="mcpArgs" variant="filled" class="w-full" />
              <label :for="k">Mcp arguments</label>
            </IftaLabel>
          </div>
        </div>
        <div class="flex flex-col" v-if="isReady">
          <!-- div>tps={{ taskEvents.perf.tps }}</div -->
          <AutoTextarea :data="prompt" @update="prompt = $event;" @run="exec()" class="w-full">
          </AutoTextarea>
          <div class="flex flex-row">
            <PromptNavbarLeft></PromptNavbarLeft>
            <div class="flex flex-row w-full justify-end items-center flex-grow">
              <div class="txt-semilight text-sm mr-2" v-if="srv.isReady">
                <Popover ref="modelsPopover">
                  <AgentParamsPicker :agent-spec="srv.agentSpec.value" @end="useAgentSettings($event);">
                  </AgentParamsPicker>
                </Popover>
                <button class="btn px-0" @click="modelsPopover.toggle($event);">{{
                  inferOptions.model != "" ? state.models[inferOptions.backend][inferOptions.model].id :
                    srv.agentSpec.value?.model
                }}</button>
              </div>
              <button class="btn flex justify-end p-3" :disabled="state.uihistory.length == 0"
                @click="confirmDelHistory()"
                :class="(state.uihistory.length == 0 || stream.length > 0) ? 'txt-light' : 'txt-semilight'">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path fill="none" stroke="currentColor" stroke-width="2"
                    d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2S2 6.477 2 12s4.477 10 10 10ZM5 5l14 14" />
                </svg>
              </button>
              <button class="btn flex justify-end p-3" :disabled="stream.length == 0 && toolCallsState.tcs.length == 0"
                @click="srv.cancel()"
                :class="stream.length == 0 && toolCallsState.tcs.length == 0 ? 'txt-semilight' : ''">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16">
                  <path fill="currentColor"
                    d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0m0 14.5a6.5 6.5 0 1 1 0-13a6.5 6.5 0 0 1 0 13M5 5h6v6H5z" />
                </svg>
              </button>
              <button class="btn flex justify-end p-3" @click="exec()"
                :class="prompt.length == 0 ? 'txt-semilight' : ''">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512">
                  <path fill="currentColor"
                    d="M440 6.5L24 246.4c-34.4 19.9-31.1 70.8 5.7 85.9L144 379.6V464c0 46.4 59.2 65.5 86.6 28.6l43.8-59.1l111.9 46.2c5.9 2.4 12.1 3.6 18.3 3.6c8.2 0 16.3-2.1 23.6-6.2c12.8-7.2 21.6-20 23.9-34.5l59.4-387.2c6.1-40.1-36.9-68.8-71.5-48.9M192 464v-64.6l36.6 15.1zm212.6-28.7l-153.8-63.5L391 169.5c10.7-15.5-9.5-33.5-23.7-21.2L155.8 332.6L48 288L464 48z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- div>
        <pre>{{ state.uihistory }}</pre>
      </div -->
    </div>
    <sw-sidebar id="sidebar-task" v-model:opened="sidebar" name="sidebar1" class="z-30 flex flex-col h-full 
    border border-l-1 border-r-0 border-y-0 bord-secondary bg-[#f1f2f4] dark:background bg-opacity-50 min-w-24">
      <SidebarInferParams :inference-params="inferOptions.params" @paramchange="updateInferParams($event)" />
      <div
        class="flex-none h-12 mb-3 text-2xl text-center cursor-pointer txt-semilight flex justify-center flex-grow items-end pb-3"
        @click="toggleSidebar()">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256" v-if="!sidebar">
          <path fill="currentColor"
            d="M208.49 199.51a12 12 0 0 1-17 17l-80-80a12 12 0 0 1 0-17l80-80a12 12 0 0 1 17 17L137 128ZM57 128l71.52-71.51a12 12 0 0 0-17-17l-80 80a12 12 0 0 0 0 17l80 80a12 12 0 0 0 17-17Z" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256">
          <path fill="currentColor"
            d="m144.49 136.49l-80 80a12 12 0 0 1-17-17L119 128L47.51 56.49a12 12 0 0 1 17-17l80 80a12 12 0 0 1-.02 17m80-17l-80-80a12 12 0 1 0-17 17L199 128l-71.52 71.51a12 12 0 0 0 17 17l80-80a12 12 0 0 0 .01-17Z" />
        </svg>
      </div>
    </sw-sidebar>
  </div>
</template>

<script setup lang="ts">
import type { AgentInferenceOptions, InferenceParams } from '@agent-smith/types';
import SwSidebar from "@snowind/sidebar";
// @ts-ignore
import type { ParsedNode } from 'markstream-vue';
import MarkdownRender, { CodeBlockNode, enableMermaid, setCustomComponents } from 'markstream-vue';
import { IftaLabel } from 'primevue';
import InputText from 'primevue/inputtext';
import { onBeforeMount, onBeforeUnmount, onMounted, reactive, ref, toRaw, watch } from 'vue';
import SidebarInferParams from '../components/sidebars/SidebarInferParams.vue';
import ThinkingContent from '../components/ThinkingContent.vue';
import ThinkingNode from '../components/ThinkingNode.vue';
import { confirmDanger, msg } from '../services/notify.js';
import { debugInference, uihistoryManager, resetCurrentFeature, setCurrentFeature, state, uistate } from '../state.js';
import AutoTextarea from '../widgets/AutoTextarea.vue';
//import ToolCallNode from '../components/ToolCallNode.vue';
import 'markstream-vue/index.css';
//import "../assets/markstream.css";
import { ToolCallSpec, UiHistoryTurn } from '@agent-smith/types';
import { useClientFeatures } from '@agent-smith/wscli';
import Popover from 'primevue/popover';
import { nextTick } from 'process';
import AgentParamsPicker from '../components/AgentParamsPicker.vue';
import FormatedToolCallInProgress from '../components/FormatedToolCallInProgress.vue';
import PromptNavbarLeft from '../components/navbars/PromptNavbarLeft.vue';
import PromptProcessingProgress from '../components/PromptProcessingProgress.vue';
import { defaultInferenceParams } from '../conf.js';
import { useTaskEvents } from '../services/task_events.js';
import FormatedToolCall from '../widgets/FormatedToolCall.vue';
import HistoryTurnStatsBar from '../widgets/HistoryTurnStatsBar.vue';
import UserEditIcon from '../widgets/icons/UserEditIcon.vue';
import ToolCallDetails from '../widgets/ToolCallDetails.vue';
import TurnTitle from '../widgets/TurnTitle.vue';

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  isAgent: {
    type: Boolean,
    default: false,
  }
});

setCustomComponents({ code_block: CodeBlockNode });
//setCustomComponents("think", { think: ThinkingNode });
//setCustomComponents("tool_call", { tool_call: ToolCallNode });
enableMermaid();

const isReady = ref(false);
const confirmRestart = ref<number | null>(null);
const modelsPopover = ref();
let maino: HTMLElement | null = null;

const nodes = ref<ParsedNode[]>([]);
const thinkingNodes = ref<ParsedNode[]>([]);
const hasThinking = ref(false);
const currentAgent = ref(props.name);
//const customHtmlTags = new Array<string>("think");
//const toolCallRequest = ref(false);
const toolCallsState = reactive<{ tcs: Array<ToolCallSpec>, from: string }>({
  tcs: [],
  from: "",
});

const stream = ref("");
const taskEvents = useTaskEvents(
  // @ts-ignore
  stream, scrollOutput, nodes, thinkingNodes, toolCallsState, hasThinking, currentAgent
);
const mcpArgs = ref("");
//const tps = ref(0);
const inferOptions = reactive<{
  params: InferenceParams,
  model: string,
  backend: string,
  propagateModel: boolean,
  propagateInferParams: boolean;
}>({
  params: defaultInferenceParams,
  model: "",
  backend: "",
  propagateModel: false,
  propagateInferParams: false,
});

const srv = useClientFeatures({
  ...taskEvents.events,
  defaultInferenceParams: defaultInferenceParams,
});
const sidebar = ref(true);
const prompt = ref("");
const question = ref("");
const nUserInteraction = ref(0);

async function exec() {
  currentAgent.value = props.name;
  //view.value = "conversation";
  state.isLoadingModel = true;
  nUserInteraction.value++;
  const p = prompt.value;
  const opts: AgentInferenceOptions = toRaw(inferOptions);
  prompt.value = "";
  let pr = p;
  if (nUserInteraction.value == 1) {
    // conversation starts
    question.value = p;
    pr = srv.agentSpec.value.prompt.replace("{prompt}", p);
    uihistoryManager.newTurn("user", props.name, 0, { user: pr });
    state.history.push({ user: pr })
  } else {
    // conversation continues
    opts.history = toRaw(state.history);
    uihistoryManager.newTurn("user", props.name, state.history.length - 1, { user: pr });
  }
  nodes.value = [];
  thinkingNodes.value = [];
  nextTick(() => {
    setMainHeight();
    scrollOutput(true, 50);
  })
  //taskEvents.onTaskStart();
  /*const tid = setInterval(() => {
    tps.value = taskEvents.perf.tps.value;
    console.log("TPS", tps.value)
  }, 500);*/
  if (debugInference.value) {
    opts.debug = true
  } else {
    opts.verbose = true
  }
  if (mcpArgs.value.length > 0) {
    opts.mcpArgs = [mcpArgs.value]
  }
  // builtin var
  if (srv?.variables?.required) {
    for (const k of Object.keys(srv.variables.required)) {
      if (k == "workspace") {
        if (state.currentWorkspace.name == "") {
          msg.warn("Workspace required", `To run ${srv.agentSpec.value.name} a workspace must be set`)
          return
        }
        srv.variables.values.required[k] = state.currentWorkspace.path;
      }
    }
  }
  if (!opts?.params) {
    opts.params = {}
  }
  opts.params.extra = { return_progress: true };
  //console.log("EXEC OPTS", opts);
  await srv.executeAgent(p, opts);
  //taskEvents.onTaskEnd();
  //clearInterval(tid);
  nUserInteraction.value++;
  scrollOutput(true, 50);
}

async function loadTask() {
  // reset opts
  inferOptions.params = defaultInferenceParams;
  inferOptions.model = "";
  inferOptions.backend = "";
  inferOptions.propagateModel = false;
  inferOptions.propagateInferParams = false;
  //console.log("Load task", props.name);
  await srv.load(props.name, props.isAgent);
  //console.log("AS", toRaw(srv.agentSpec.value));
  let hasSettings = props.name in state.agentsSettings;
  let m = "";
  if (hasSettings) {
    for (const [k, v] of Object.entries(state.agentsSettings[props.name])) {
      //console.log("S", k, v)
      if (k == "model") {
        //inferOptions.model = state.models[v].id;
        //state.currentModel = state.models[v];
        m = v;
      } else if (k == "backend") {
        inferOptions.backend = v
      } else if (k == "props") {
        if (v?.propagateModel) {
          inferOptions.propagateModel = v.propagateModel
        }
        if (v?.propagateInferParams) {
          inferOptions.propagateInferParams = v.propagateInferParams
        }
      } else {
        inferOptions.params[k] = v
      }
    }
  }
  else if (srv.agentSpec.value?.inferParams) {
    for (const [k, v] of Object.entries(srv.agentSpec.value.inferParams)) {
      inferOptions.params[k] = v
    }
  }
  const b = inferOptions?.backend ?? uistate.value.backend;
  state.onReady.then(() => {
    if (m.length > 0) {
      inferOptions.model = state.models[b][m].id;
      state.currentModel = state.models[b][m];
    }
    if (state.currentModel?.id == "") {
      state.currentModel = state.models[b][srv.agentSpec.value.model];
    }
  });
  setCurrentFeature(props.name, "agent");
  isReady.value = true;
};

function restartAtTurn(n: number) {
  //console.log("Restart at", n);
  taskEvents.resetStream();
  if (n == 0) {
    prompt.value = question.value;
    question.value = "";
    state.uihistory = [];
    state.history = [];
    confirmRestart.value = null;
    nUserInteraction.value = 0;
    return
  }
  prompt.value = state.uihistory[n].user ?? "";
  //console.log("Restart 2 n", n, "/", state.uihistory.length, state.uihistory[n - 1]);
  state.uihistory = state.uihistory.slice(0, n);
  const at = state.uihistory[n - 1].agentTurn + 1;
  //console.log("Restart 3 n", n - 1, "at", at);
  if (at > 0) {
    state.history = state.history.slice(0, at + 1);
  } else {
    state.history = [state.history[0]];
  }
  //console.log("H", toRaw(state.history));
  confirmRestart.value = null;
  nUserInteraction.value = n;
  //console.log("SH1", state.history);
  //history.reset();
}

function useAgentSettings(data: {
  params: InferenceParams,
  model: string,
  backend: string,
  propagateModel: boolean,
  propagateInferParams: boolean;
}) {
  inferOptions.params = data.params;
  inferOptions.model = data.model;
  inferOptions.backend = data.backend;
  inferOptions.propagateModel = data.propagateModel;
  inferOptions.propagateInferParams = data.propagateInferParams;
  state.currentModel = state.models[data.backend][data.model];
  modelsPopover.value.toggle();
}

function updateInferParams(evt: InferenceParams) {
  const ip = toRaw(evt);
  //console.log("Update IP", ip);
  inferOptions.params = ip;
}

function setPromptInputWidth() {
  const sb = document.getElementById('sidebar-task');
  const pi = document.getElementById('prompt-input');
  // @ts-ignore
  pi.style.width = `calc( 83.333333% - ${sb.offsetWidth}px)`;
}

function toggleSidebar() {
  sidebar.value = !sidebar.value;
  setTimeout(() => {
    setPromptInputWidth();
  }, 250);
}

function confirmDelHistory() {
  confirmDanger("Start a new conversation?", "Remove this conversation history and start a new one",
    async () => {
      taskEvents.resetStream();
      restartAtTurn(0)
    }
  )
}

function scrollOutput(nosmooth: boolean = true, delay = 0) {
  if (!uistate.value.autoscroll) { return }
  if (!maino) {
    maino = document.getElementById('bottom-output')!;
  }
  const p: ScrollIntoViewOptions = { block: "end", inline: "nearest" };
  if (nosmooth) {
    p.behavior = "instant"
  } else {
    p.behavior = "smooth"
  }
  if (delay > 0) {
    setTimeout(() => {
      // @ts-ignore
      maino.scrollIntoView(p);
    }, delay);
  } else {
    maino.scrollIntoView(p);
  }
}

function toggleViewToolResult(id: string, turn: UiHistoryTurn) {
  //console.log("TOGGLE TOOL RESULT VIEW", id in turn.state.confirmToolCalls);
  if (id in turn.state.confirmToolCalls) {
    return
  }
  if (turn.state.showToolResponses.includes(id)) {
    turn.state.showToolResponses = turn.state.showToolResponses.filter(r => r != id)
  } else {
    turn.state.showToolResponses.push(id)
  }
}

function load() {
  if (state.isReady) {
    loadTask()
  } else {
    state.onReady.then(r => loadTask())
  }
}

function setMainHeight() {
  // @ts-ignore
  const offsetHeight = document.getElementById('prompt-input').offsetHeight
  const maino = document.getElementById('main-output')!;
  maino.style.height = `calc(100% - ${offsetHeight}px)`;
}

onBeforeMount(() => {
  load();
});

onMounted(() => setPromptInputWidth());

onBeforeUnmount(() => resetCurrentFeature())

watch(props, () => {
  if (props.name != srv.agentSpec.value?.name) {
    console.log("W", props.name, srv.agentSpec.value?.name)
    resetCurrentFeature();
    taskEvents.resetStream();
    srv.isReady.value = false;
    load()
  };
});
watch(prompt, () => {
  setMainHeight();
  //console.log("PR", offsetHeight, "/", maino.offsetHeight)
})
</script>

<style lang="sass" scoped>
.opened.sw-sidebar
  width: 24rem

.toolcall.slidedown
  max-height: 400px;

.paragraph-node
  margin: 0 !important
</style>
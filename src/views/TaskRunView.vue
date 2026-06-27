<template>
  <div class="flex flex-row h-main">
    <div id="main-output" class="flex flex-col grow h-full overflow-y-auto ">
      <div class="flex flex-col grow overflow-y-auto p-3">
        <template v-if="state.uihistory.length > 0">
          <div v-for="(turn, i) in state.uihistory" class="flex flex-col">
            <div class="flex flex-row">
              <a :id="`turn-${i}`"></a>
              <div class="grow">
                <TurnTitle name="user" v-if="i == 0"></TurnTitle>
                <TurnTitle :name="turn.from" v-else-if="state.uihistory[i - 1].from != turn.from" class="pt-3">
                </TurnTitle>
                <div v-if="turn?.user" class="p-3">
                  <!-- MarkdownRender :content="turn.user" v-if="uistate.viewMode == 'markdown'" / -->
                  <div class="text-semilight" v-html="turn.user.replaceAll('\n', '<br />')"></div>
                </div>
                <div v-if="turn?.prefillStats" class="pl-3">
                  <PromptProcessingProgress v-if="turn.prefillStats.total > 0"
                    :prompt-processing-stats="turn.prefillStats">
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
              <button class="btn flex flex-row items-center text-light hover:secondary pl-3"
                :disabled="stream.length > 0 || toolCallsState.tcs.length > 0" @click="confirmRestartAtTurn(i + 1)">
                <RestartIcon width="24" height="24"></RestartIcon>
                <div>{{ i + 1 }}</div>
              </button>
            </div>
          </div>
        </template>
        <div v-if="state.isLoadingModel" class="pl-6 text-semilight">
          Loading {{ state.currentModel.id }} model ...
        </div>
        <div v-if="state.isProcessingPrompt" class="pb-3 pl-3">
          <PromptProcessingProgress :prompt-processing-stats="state.promptProcessingProgress">
          </PromptProcessingProgress>
        </div>
        <div v-if="stream.length > 0">
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
      <div id="prompt-input" class="px-3 pb-5 flex flex-col z-20">
        <div class="flex flex-wrap gap-3 mb-3" v-if="srv.isReady">
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
            <div class="flex flex-row justify-end items-center grow">
              <!-- div v-if="prompt.length > 0">
                <button class="btn" @click="applyTemplateToPrompt(prompt, srv, inferOptions)">T</button>
              </div -->
              <div class="text-semilight text-sm mr-2" v-if="srv.isReady">
                <Popover ref="modelsPopover">
                  <AgentParamsPicker :agent-spec="srv.agentSpec.value" @end="useAgentSettings($event);">
                  </AgentParamsPicker>
                </Popover>
                <button class="btn p-0 hover:secondary" @click="modelsPopover.toggle($event);">{{
                  inferOptions.model != "" ?
                    inferOptions.model :
                    srv.agentSpec.value?.model
                }}</button>
              </div>
              <button class="btn flex justify-end p-3" :disabled="state.uihistory.length == 0"
                @click="confirmDelHistory(); toolCallsState.from = ''; toolCallsState.tcs = []"
                :class="(state.uihistory.length == 0 || stream.length > 0) ? 'text-light' : 'text-semilight'">
                <ResetIcon width="24" height="24"></ResetIcon>
              </button>
              <button class="btn flex justify-end p-3"
                :disabled="!taskEvents.isStreaming && toolCallsState.tcs.length == 0"
                @click="srv.cancel(); toolCallsState.from = ''; toolCallsState.tcs = []; taskEvents.isStreaming.value = false"
                :class="stream.length == 0 && toolCallsState.tcs.length == 0 ? 'text-semilight' : ''">
                <StopIcon width="24" height="24"></StopIcon>
              </button>
              <button class="btn flex justify-end p-3" @click="exec()"
                :class="prompt.length == 0 ? 'text-semilight' : ''">
                <SendIcon width="24" height="24"></SendIcon>
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- div>
        <pre>{{ state.uihistory }}</pre>
      </div -->
    </div>
    <div id="sidebar-task2" name="sidebar1" class="z-30 flex flex-col h-full 
    border border-l border-r-0 border-y-0 border-lighter" :class="inferenceSidebarWidth">
      <SidebarRightDispatch :inference-params="inferOptions.params" @paramchange="updateInferParams($event)"
        @goto-turn="jumpToTurn($event)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AgentInferenceOptions, InferenceParams } from '@agent-smith/types';
// @ts-ignore
import type { ParsedNode } from 'markstream-vue';
import MarkdownRender, { CodeBlockNode, enableMermaid, setCustomComponents } from 'markstream-vue';
import { IftaLabel } from 'primevue';
import InputText from 'primevue/inputtext';
import { computed, onBeforeMount, onBeforeUnmount, onMounted, reactive, ref, toRaw, watch } from 'vue';
import ThinkingContent from '../components/ThinkingContent.vue';
import ThinkingNode from '../components/ThinkingNode.vue';
import { confirmDanger, msg } from '../services/notify.js';
import { debugInference, resetCurrentFeature, setCurrentFeature, state, uihistoryManager, uistate } from '../state.js';
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
import SidebarRightDispatch from '../components/sidebars/SidebarRightDispatch.vue';
import { defaultInferenceParams } from '../conf.js';
import { useTaskEvents } from '../services/task_events.js';
import FormatedToolCall from '../widgets/FormatedToolCall.vue';
import HistoryTurnStatsBar from '../widgets/HistoryTurnStatsBar.vue';
import RestartIcon from '../widgets/icons/RestartIcon.vue';
import ToolCallDetails from '../widgets/ToolCallDetails.vue';
import TurnTitle from '../widgets/TurnTitle.vue';
import ResetIcon from '../widgets/icons/ResetIcon.vue';
import StopIcon from '../widgets/icons/StopIcon.vue';
import SendIcon from '../widgets/icons/SendIcon.vue';

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
  //state.history = state.uihistory;
  if (nUserInteraction.value < 2) {
    // conversation starts
    question.value = p;
    pr = srv.agentSpec.value.prompt.replace("{prompt}", p);
    uihistoryManager.newTurn("user", props.name, 0, { user: pr });
    opts.history = [];
  } else {
    // conversation continues
    opts.history = [...toRaw(state.history)];
    uihistoryManager.newTurn("user", props.name, state.history.length - 1, { user: pr });
  }
  state.history.push({ user: pr });
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
    for (const k of Object.keys(toRaw(srv.variables.required))) {
      console.log("K", k, srv?.agentSpec?.value?.name)
      if (k == "workspace") {
        if (!state?.currentWorkspace?.name) {
          msg.warn("Workspace required", `To run ${srv.agentSpec.value.name} a workspace must be set`)
          prompt.value = question.value;
          uihistoryManager.reset();
          state.isLoadingModel = false;
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
  //console.log("EXEC AGENT", p, opts);
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
        inferOptions.model = v;
        state.currentModel = v;
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
  if (n <= 1) {
    prompt.value = n == 1 ? question.value : "";
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
  state.currentModel = state.backends[data.backend]?.type == "openai" ? { id: data.model, ctx: 8192, status: "", hasVision: false } :
    state.models[data.backend][data.model];
  modelsPopover.value.toggle();
}

function updateInferParams(evt: InferenceParams) {
  const ip = toRaw(evt);
  //console.log("Update IP", ip);
  inferOptions.params = ip;
}

function confirmDelHistory() {
  confirmDanger("Start a new conversation?", "Remove this conversation history and start a new one",
    async () => {
      taskEvents.resetStream();
      state.history = [];
      state.uihistory = [];
      restartAtTurn(-1)
    }
  )
}

function confirmRestartAtTurn(i: number) {
  confirmDanger(`Restart at turn ${i}?`, `This will reset conversation history to turn ${i}`,
    async () => {
      taskEvents.resetStream();
      restartAtTurn(i)
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
  //const offsetHeight = document.getElementById('prompt-input').offsetHeight
  //const maino = document.getElementById('main-output')!;
  //maino.style.height = `calc(100% - ${offsetHeight}px)`;
}

function jumpToTurn(i: number) {
  //console.log("GOTO", i);
  const o: ScrollIntoViewOptions = { block: "start", inline: "nearest", behavior: "smooth" };
  const a = `turn-${i}`;
  const el = document.getElementById(a)!;
  el.scrollIntoView(o)
}

const inferenceSidebarWidth = computed(() => {
  if (uistate.value.inferenceSidebar == 'full') {
    return 'min-w-[20rem]'
  } else if (uistate.value.inferenceSidebar == 'mini') {
    return 'min-w-[5rem]'
  }
  return 'hidden'
})

onBeforeMount(() => {
  load();
});

onBeforeUnmount(() => resetCurrentFeature())

watch(props, () => {
  if (props.name != srv.agentSpec.value?.name) {
    //console.log("W", props.name, srv.agentSpec.value?.name)
    resetCurrentFeature();
    taskEvents.resetStream();
    srv.isReady.value = false;
    load()
  };
});
/*watch(prompt, () => {
  setMainHeight();
  //console.log("PR", offsetHeight, "/", maino.offsetHeight)
})*/
</script>

<style lang="sass" scoped>
.opened.sw-sidebar
  width: 20rem

.toolcall.slidedown
  max-height: 400px;

.paragraph-node
  margin: 0 !important
</style>
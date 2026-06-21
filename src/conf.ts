import type { InferenceParams } from "@agent-smith/types";

const defaultInferenceParams: InferenceParams = {
    temperature: undefined,
    top_k: undefined,
    top_p: undefined,
    min_p: undefined,
    repeat_penalty: undefined,
    presence_penalty: undefined,
    frequency_penalty: undefined,
}

const availablePlugins = [
    {
        name: "@agent-smith/feat-agents",
        description: "agents and skills"
    },
    {
        name: "@agent-smith/feat-fs",
        description: "filesystem tools and agents"
    },
    {
        name: "@agent-smith/feat-shell",
        description: "sandboxed shell"
    },
    {
        name: "@agent-smith/feat-search",
        description: "web search features"
    },
    {
        name: "@agent-smith/lynx-coder",
        description: "Lynx AI coding agents"
    },
];

export {
    defaultInferenceParams,
    availablePlugins,
}
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

export {
    defaultInferenceParams,
}
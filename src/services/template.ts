import type { ChatCompletionHistoryTurn, ClientFeaturesService } from "@agent-smith/types";
import { state } from "../state.js";
import { api } from "./api.js";

async function applyTemplateToPrompt(prompt: string, srv: ClientFeaturesService, inferOptions: Record<string, any>) {
    await state.onReady;
    const m = inferOptions.model != "" ?
        state.models[inferOptions.backend][inferOptions.model].id :
        srv.agentSpec.value?.model
    if (!m) {
        console.log(`need a model to apply template`);
        return
    }
    const msgs = new Array<ChatCompletionHistoryTurn>();
    if (srv.agentSpec?.value.template?.system) {
        msgs.push({
            role: "system",
            content: srv.agentSpec.value.template.system
        })
    }
    msgs.push({
        role: "user",
        content: prompt,
    });
    const payload = {
        modelName: m,
        messages: msgs,
    }
    const res = await api.post("/templates/apply", payload);
    return res
}

export {
    applyTemplateToPrompt,
}
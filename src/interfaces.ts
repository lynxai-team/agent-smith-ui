import type { ToolTurn, UiHistoryTurn } from "@agent-smith/types";

interface UiToolTurn extends ToolTurn {
    subHistory?: AgentUiHistoryTurn[];   // present when this call launched a subagent
}

interface AgentUiHistoryTurn extends UiHistoryTurn {
    tools?: UiToolTurn[];               // shadows UiHistoryTurn.tools (narrowed, assignable)
}

interface NotificationMsg {
    info: (title: any, body: string, lifeTime?: number) => void;
    success: (title: string, body: string, lifeTime?: number) => void;
    warn: (title: string, body: string, lifeTime?: number) => void;
    error: (title: string, body: string, lifeTime?: number) => void;
}

type SidebarType = "tasks" | "agents" | "workflows" | "tools" | "mcp";
type UiTaskView = "view" | "run";

export {
    SidebarType,
    UiTaskView,
    NotificationMsg,
    AgentUiHistoryTurn,
    UiToolTurn,
}
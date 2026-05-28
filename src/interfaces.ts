type SidebarType = "tasks" | "agents" | "workflows" | "tools" | "mcp";
type UiTaskView = "view" | "run";

interface NotificationMsg {
    info: (title: any, body: string, lifeTime?: number) => void;
    success: (title: string, body: string, lifeTime?: number) => void;
    warn: (title: string, body: string, lifeTime?: number) => void;
    error: (title: string, body: string, lifeTime?: number) => void;
}

export {
    SidebarType,
    UiTaskView,
    NotificationMsg,
}
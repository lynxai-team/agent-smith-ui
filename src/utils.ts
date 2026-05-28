import { humanize } from "./services/str.js";

function createAwaiter<T = boolean>() {
    let resolveFn: (value: T) => void;
    let rejectFn: (reason?: any) => void;

    const promise = new Promise<T>((resolve, reject) => {
        resolveFn = resolve;
        rejectFn = reject;
    });

    return {
        awaiter: promise,
        unblock: resolveFn!,
        reject: rejectFn!
    };
}

function transformTasksData(data: Record<string, string>): any[] {
    const result: any[] = [];
    const map = new Map<string, any>();

    for (const [key, value] of Object.entries(data)) {
        const parts = value.split('/');
        const [first, second, third] = parts;

        // Create root level
        let root = map.get(first);
        if (!root) {
            root = { key: first, label: humanize(first), children: [] };
            map.set(first, root);
            result.push(root);
        }

        // If only first level, add as child
        if (!second) {
            root.children.push({ key, label: humanize(key) });
            continue;
        }

        // Create second level
        let secondLevel = root.children.find((c: any) => c.key === second);
        if (!secondLevel) {
            secondLevel = { key: second, label: humanize(second), children: [] };
            root.children.push(secondLevel);
        }

        // Create third level if exists
        if (third) {
            let thirdLevel = secondLevel.children.find((c: any) => c.key === third);
            if (!thirdLevel) {
                thirdLevel = { key: third, label: humanize(third), children: [] };
                secondLevel.children.push(thirdLevel);
            }
            thirdLevel.children.push({ key, label: humanize(key) });
        } else {
            // Direct child of second level
            secondLevel.children.push({ key, label: humanize(key) });
        }
    }

    return result;
}

export {
    createAwaiter,
    transformTasksData
};

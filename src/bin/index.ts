#!/usr/bin/env node
import { fileURLToPath } from 'url';
import path from 'path';
import { runServer, baseRoutes } from '@agent-smith/server';
import type { Router } from 'vue-router';

const appRoutes: Array<(r: Router) => void> = [];
const __filename = fileURLToPath(import.meta.url);
const dirpath = path.resolve(path.dirname(__filename), "../");
/*try {
    const rp = path.join(dirpath, 'apps/routes.js');
    //console.log("RP", rp);
    const mods = (await import(rp)).default;
    //console.log("MOD", mods);
    for (const mod of mods) {
        //console.log("ROUTES", mod)
        //@ts-ignore
        for (const route of mod.default.routes) {
            appRoutes.push(route)
        }
    }
} catch (e) {
    console.warn("route import failed", e)
}*/

async function main() {
    //console.log(dirpath, process.env.NODE_ENV);
    let staticPath: string | undefined = undefined;
    if (process.env.NODE_ENV != "development") {
        staticPath = dirpath
    }
    //console.log("B", baseRoutes);
    // @ts-ignore
    runServer([...baseRoutes, ...appRoutes], staticPath);
}

(async () => {
    await main();
})();
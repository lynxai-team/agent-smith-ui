import { useApi } from 'restmix';
import { ApiResponse } from "restmix";
import { msg } from './notify.js';
import { port } from '../conf.js';

const api = useApi({
    serverUrl: `http://localhost:${port}/api`
});

/*api.onResponse(async <T>(res: ApiResponse<T>): Promise<ApiResponse<T>> => {
    console.log("Response", res.status, JSON.stringify(res, null, "  "));
    if (!res.ok) {
        if ([401, 403].includes(res.status)) {
            console.warn("Unauthorized request", res.status, "from", res.url)
            msg.warn("Unauthorized request", res.status + " from " + res.url)
        } else if (res.status == 500) {
            console.warn("Server error", res.status, "from", res.url)
            msg.error("Server error", res.status + " from " + res.url)
        } else {
            console.warn("Error", res.status, "from", res.url)
            msg.warn("Error", res.status + " from " + res.url)
        }
    }
    return res
});*/

export {
    api
};

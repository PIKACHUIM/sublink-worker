import { createApp } from '../app/createApp.jsx';
import { createEdgeOneRuntime } from '../runtime/edgeone.js';

let appPromise;

export function handleEdgeOneRequest({ request, env }) {
    if (!appPromise) {
        appPromise = createEdgeOneRuntime(env)
            .then((runtime) => createApp(runtime))
            .catch((error) => {
                appPromise = null;
                throw error;
            });
    }
    return appPromise.then((app) => app.fetch(request));
}

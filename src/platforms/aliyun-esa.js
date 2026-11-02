import { createApp } from '../app/createApp.jsx';
import { createAliyunEsaRuntime } from '../runtime/aliyunEsa.js';

let app;

export default {
    fetch(request) {
        if (!app) {
            const env = typeof process === 'undefined' ? {} : process.env;
            app = createApp(createAliyunEsaRuntime(env));
        }
        return app.fetch(request);
    }
};

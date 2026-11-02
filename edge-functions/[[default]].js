import { handleEdgeOneRequest } from '../src/platforms/edgeone.js';

export function onRequest(context) {
    return handleEdgeOneRequest(context);
}

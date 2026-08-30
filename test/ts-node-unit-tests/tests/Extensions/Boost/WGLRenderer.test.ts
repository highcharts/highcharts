import { strictEqual } from 'node:assert';
import { describe, it } from 'node:test';

import WGLRenderer from '../../../../../ts/Extensions/Boost/WGLRenderer';

describe('WGLRenderer', () => {
    it('does not retry rendering after initialization failed', () => {
        const renderer = new WGLRenderer(() => {});
        const originalSetTimeout = globalThis.setTimeout;
        let scheduledTimeouts = 0;

        globalThis.setTimeout = (() => {
            ++scheduledTimeouts;
            return 1;
        }) as unknown as typeof setTimeout;

        try {
            strictEqual(
                renderer.render({
                    renderer: { forExport: false }
                } as any),
                false
            );
            strictEqual(scheduledTimeouts, 0);
        } finally {
            globalThis.setTimeout = originalSetTimeout;
        }
    });
});

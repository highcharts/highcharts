import { strictEqual } from 'node:assert';
import { describe, it } from 'node:test';

import NavigatorCrossfilterSync from '../../../../ts/Dashboards/Components/NavigatorComponent/NavigatorSyncs/NavigatorCrossfilterSync';
import NavigatorExtremesSync from '../../../../ts/Dashboards/Components/NavigatorComponent/NavigatorSyncs/NavigatorExtremesSync';
import { fireEvent } from '../../../../ts/Shared/Utilities';

describe('Navigator sync emitters', () => {
    it('cancels pending emissions when removed', () => {
        const originalClearTimeout = globalThis.clearTimeout;
        let clearedTimeouts = 0;

        globalThis.clearTimeout = ((timeoutId): void => {
            if (timeoutId !== void 0) {
                ++clearedTimeouts;
            }
            originalClearTimeout(timeoutId);
        }) as typeof clearTimeout;

        try {
            for (const [sync, syncConfig] of [
                [NavigatorCrossfilterSync, { crossfilter: {} }],
                [NavigatorExtremesSync, { extremes: {} }]
            ] as const) {
                const axis = {};
                const component = {
                    chart: { xAxis: [axis] },
                    sync: { syncConfig },
                    type: 'Navigator'
                };
                const remove = sync.syncPair.emitter?.call(component as any);

                fireEvent(axis, 'afterSetExtremes', { min: 1, max: 2 });
                remove?.();

                strictEqual(
                    (axis as any).hcEvents.afterSetExtremes.length,
                    0
                );
            }

            strictEqual(clearedTimeouts, 2);
        } finally {
            globalThis.clearTimeout = originalClearTimeout;
        }
    });
});

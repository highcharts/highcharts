/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 * */

'use strict';

import assert from 'node:assert';
import { describe, it } from 'node:test';

import Sync from '../../../../ts/Dashboards/Components/Sync/Sync.js';
import SyncEmitter from
    '../../../../ts/Dashboards/Components/Sync/Emitter.js';
import SyncHandler from
    '../../../../ts/Dashboards/Components/Sync/Handler.js';

describe('Dashboard synchronization', (): void => {
    it('should support prototype-named sync IDs', (): void => {
        const syncOptions = Object.create(null),
            callbacks: string[] = [];

        for (const id of ['toString', '__proto__']) {
            syncOptions[id] = {
                enabled: true,
                emitter: (): (() => void) => {
                    callbacks.push(`create-${id}`);
                    return (): void => callbacks.push(`remove-${id}`);
                },
                handler: (): (() => void) => {
                    callbacks.push(`register-${id}`);
                    return (): void => callbacks.push(`unregister-${id}`);
                }
            };
        }

        const component = {
                on: (): (() => void) => (): void => {},
                options: { sync: syncOptions }
            },
            sync = new Sync(component as never, {
                defaultSyncOptions: {},
                defaultSyncPairs: {}
            });

        sync.start();
        assert.deepStrictEqual(callbacks, [
            'register-toString',
            'create-toString',
            'register-__proto__',
            'create-__proto__'
        ]);
        assert.strictEqual(SyncHandler.get('toString')?.id, 'toString');
        assert.strictEqual(SyncEmitter.get('__proto__')?.id, '__proto__');

        sync.stop();
        assert.deepStrictEqual(callbacks.slice(4), [
            'unregister-toString',
            'unregister-__proto__',
            'remove-toString',
            'remove-__proto__'
        ]);
    });
});

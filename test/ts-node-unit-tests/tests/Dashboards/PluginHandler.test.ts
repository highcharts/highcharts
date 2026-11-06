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

import { setupDOM } from '../../test-utils.js';

describe('PluginHandler', (): void => {
    it('should support prototype-named plugin keys', async (): Promise<void> => {
        const { doc, win } = setupDOM();
        global.window = win;
        global.document = doc;

        const { default: PluginHandler } = await import(
            '../../../../ts/Dashboards/PluginHandler.js'
        );
        let registered = 0,
            unregistered = 0;
        const plugin = {
            custom: {},
            name: 'toString',
            onRegister: (): void => {
                ++registered;
            },
            onUnregister: (): void => {
                ++unregistered;
            }
        };

        PluginHandler.addPlugin(plugin);
        assert.strictEqual(PluginHandler.registry.toString, plugin);
        assert.strictEqual(registered, 1);

        PluginHandler.removePlugin('toString');
        assert.strictEqual(unregistered, 1);
        assert.strictEqual(
            Object.hasOwn(PluginHandler.registry, 'toString'),
            false
        );
    });
});

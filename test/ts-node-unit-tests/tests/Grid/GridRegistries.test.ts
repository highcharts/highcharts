/* *
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 * */

'use strict';

import assert from 'node:assert';
import { describe, it } from 'node:test';

import DataProviderRegistry from
    '../../../../ts/Grid/Core/Data/DataProviderRegistry.js';
import CellRendererRegistry from
    '../../../../ts/Grid/Pro/CellRendering/CellRendererRegistry.js';

describe('Grid registries', (): void => {
    it('should support prototype-named provider and renderer types', (): void => {
        class CustomType {}

        assert.strictEqual(
            DataProviderRegistry.registerDataProvider(
                'toString' as never,
                CustomType as never
            ),
            true
        );
        assert.strictEqual(
            CellRendererRegistry.registerRenderer(
                '__proto__' as never,
                CustomType as never
            ),
            true
        );
        assert.strictEqual(
            DataProviderRegistry.types.toString,
            CustomType
        );
        assert.strictEqual(
            CellRendererRegistry.types.__proto__,
            CustomType
        );

        delete DataProviderRegistry.types.toString;
        delete CellRendererRegistry.types.__proto__;
    });
});

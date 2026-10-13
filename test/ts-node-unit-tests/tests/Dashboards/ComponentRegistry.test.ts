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

import ComponentRegistry from
    '../../../../ts/Dashboards/Components/ComponentRegistry.js';

describe('ComponentRegistry', (): void => {
    it('should support prototype-named component types', (): void => {
        class ToStringComponent {}
        class PrototypeComponent {}

        assert.strictEqual(
            ComponentRegistry.registerComponent(
                'toString' as never,
                ToStringComponent as never
            ),
            true
        );
        assert.strictEqual(
            ComponentRegistry.registerComponent(
                '__proto__' as never,
                PrototypeComponent as never
            ),
            true
        );
        assert.strictEqual(
            ComponentRegistry.types.toString,
            ToStringComponent
        );
        assert.strictEqual(
            ComponentRegistry.types.__proto__,
            PrototypeComponent
        );

        delete ComponentRegistry.types.toString;
        delete ComponentRegistry.types.__proto__;
    });
});

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

import Serializable from '../../../../ts/Dashboards/Serializable.js';

describe('Serializable registry', (): void => {
    it('should support prototype-named serializers', (): void => {
        const classPrototype = {
            fromJSON: (): Record<string, boolean> => ({ classResult: true }),
            toJSON: (): Record<string, string> => ({ $class: 'toString' })
        };
        const helper = {
            $class: '__proto__',
            fromJSON: (): Record<string, boolean> => ({ helper: true }),
            jsonSupportFor: (): boolean => false,
            toJSON: (): Record<string, string> => ({ $class: '__proto__' })
        };

        Serializable.registerClassPrototype(
            'toString',
            classPrototype as never
        );
        Serializable.registerHelper(helper as never);

        assert.deepStrictEqual(
            Serializable.fromJSON({ $class: 'toString' }),
            { classResult: true }
        );
        assert.deepStrictEqual(
            Serializable.fromJSON({ $class: '__proto__' }),
            { helper: true }
        );
    });
});

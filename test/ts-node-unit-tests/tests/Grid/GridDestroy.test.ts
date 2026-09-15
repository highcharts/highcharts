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

import { setupDOM } from '../../test-utils.js';

describe('Grid.destroy', (): void => {
    it('should not unregister another Grid when called twice',
        async (): Promise<void> => {
            const { doc, win } = setupDOM();
            global.window = win;
            global.document = doc;

            const GridModule = await import(
                    '../../../../ts/Grid/Core/Grid.js'
                ),
                Grid = (
                    (GridModule.default as any).default ?? GridModule.default
                ),
                first = Object.create(Grid.prototype),
                second = Object.create(Grid.prototype);

            Grid.grids.length = 0;
            Grid.grids.push(first, second);

            first.destroy();
            first.destroy();

            assert.deepStrictEqual(Grid.grids, [second]);
            Grid.grids.length = 0;
        });
});

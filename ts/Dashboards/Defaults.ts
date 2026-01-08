/* *
 *
 *  Dashboards default options
 *
 *  (c) 2009-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type Board from './Board';
import type { DeepPartial } from '../Shared/Types';

import Utils from '../Core/Utilities.js';
const { merge } = Utils;

/**
 * Namespace for default options.
 */
namespace Defaults {
    /**
     * Default options for the Board.
     */
    export const defaultOptions: Board.Options = {
        gui: {
            enabled: true,
            layoutOptions: {
                rowClassName: void 0,
                cellClassName: void 0
            },
            layouts: []
        },
        components: []
    };

    /**
     * Merge the default options with custom options. Commonly used for defining
     * reusable templates.
     *
     * @param options
     * The new custom board options.
     */
    export function setOptions(options: DeepPartial<Board.Options>): void {
        merge(true, Defaults.defaultOptions, options);
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default Defaults;

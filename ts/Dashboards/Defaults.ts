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

import type { Options as BoardOptions } from './Board';
import type { DeepPartial } from '../Shared/Types';

import Utils from '../Core/Utilities.js';
const { merge } = Utils;

/**
 * Default options for the Board.
 */
export const defaultOptions: BoardOptions = {
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
export function setOptions(options: DeepPartial<BoardOptions>): void {
    merge(true, defaultOptions, options);
}

/* *
 *
 *  Default Export
 *
 * */

const Defaults = {
    defaultOptions,
    setOptions
};

export default Defaults;

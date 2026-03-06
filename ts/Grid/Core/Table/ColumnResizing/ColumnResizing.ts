/* *
 *
 *  Column Resizing namespace
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 *  Authors:
 *  - Dawid Dragula
 *
 * */

'use strict';


/* *
 *
 *  Imports
 *
 * */

import type Table from '../Table';

import ResizingMode from './ResizingMode.js';
import AdjacentResizingMode from './AdjacentResizingMode.js';
import IndependentResizingMode from './IndependentResizingMode.js';
import DistributedResizingMode from './DistributedResizingMode.js';

/* *
 *
 *  Declarations
 *
 * */

export type ColumnResizingMode = keyof typeof types;


/* *
 *
 *  Definitions
 *
 * */

/**
 * Abstract class representing a column resizing mode.
 */
export const AbstractStrategy = ResizingMode;

/**
 * Registry of column resizing modes.
 */
export const types = {
    adjacent: AdjacentResizingMode,
    distributed: DistributedResizingMode,
    independent: IndependentResizingMode
};

/**
 * Creates a new column resizing mode instance based on the
 * viewport's options.
 *
 * @param viewport
 * The table that the column resizing mode is applied to.
 *
 * @returns
 * The proper column resizing mode.
 */
export function initMode(viewport: Table): ResizingMode {
    const modeName =
        viewport.grid.options?.rendering?.columns?.resizing?.mode ||
        'adjacent';
    let ModeConstructor = types[modeName];

    if (!ModeConstructor) {
        // eslint-disable-next-line no-console
        console.warn(
            `Unknown column resizing mode: '${modeName}'. Applied ` +
            'default \'adjacent\' mode.'
        );
        ModeConstructor = types.adjacent;
    }

    return new ModeConstructor(viewport);
}


/* *
 *
 *  Default Export
 *
 * */

export default {
    initMode,
    types,
    AbstractStrategy
} as const;

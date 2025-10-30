/* *
 *
 *  Column Resizing namespace
 *
 *  (c) 2020-2025 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
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
 *  Namespace
 *
 * */

namespace ColumnResizing {

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

    export type ModeType = keyof typeof types;

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

}


/* *
 *
 *  Default Export
 *
 * */

export default ColumnResizing;

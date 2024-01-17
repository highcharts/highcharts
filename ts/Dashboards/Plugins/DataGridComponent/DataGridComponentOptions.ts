/* *
 *
 *  (c) 2009-2024 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Karol Kolodziej
 *
 * */

'use strict';


/* *
 *
 *  Imports
 *
 * */

import type BaseDataGridOptions from '../../../DataGrid/DataGridOptions';
import type Component from '../../Components/Component';
import type Sync from '../../Components/Sync/Sync';

/* *
 *
 *  Declarations
 *
 * */

/**
 * Options to control the DataGrid component.
 */
export interface Options extends Component.Options {
    /**
     * The style class to add to the rendered data grid container.
     */
    dataGridClassName?: string;

    /**
     * The identifier for the rendered data grid container.
     */
    dataGridID?: string;

    /**
     * Callback to use when a change in the data grid occurs.
     *
     * @private
     *
     * @param e
     * Related keyboard event of the change.
     *
     * @param connector
     * Relate store of the change.
     */
    onUpdate(e: KeyboardEvent, connector: Component.ConnectorTypes): void

    type: 'DataGrid';
    /**
     * Generic options to adjust behavior and styling of the rendered data
     * grid.
     */
    dataGridOptions?: BaseDataGridOptions;

    /**
     * The set of options like `dataGridClassName` and `dataGridID`.
     */
    chartClassName?: string;

    /**
     * The id that is applied to the chart's container.
     */
    chartID?: string;

    /** @private */
    tableAxisMap?: Record<string, string | null>;

    /**
     * Sync options for the component.
     */
    syncHandlers?: Sync.OptionsRecord;

    /**
     * If the `visibleColumns` option is not provided, the data grid will
     * calculate and include each column from the data connector.
     * When declared, the data grid will only include the columns that are
     * listed.
     *
     * Alternatively, the column visibility can be controlled by the
     * `dataGridOptions.columns` option.
     * ```
     * Example
     * visibleColumns: ['Food', 'Vitamin A']
     * ```
     */
    visibleColumns?: Array<string>;
}


/* *
 *
 *  Default Export
 *
 * */


export default Options;

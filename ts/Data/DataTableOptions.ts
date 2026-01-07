/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 *  Authors:
 *  - Sophie Bremer
 *  - Dawid Dragula
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type { TypedArray } from '../Shared/Types';


/* *
 *
 *  Declarations
 *
 * */


/**
 * Options to initialize a new DataTable instance.
 */
export interface DataTableOptions {

    /**
     * Initial columns with their values.
     */
    columns?: Record<string, Array<DataTableValue>|TypedArray>;

    /**
     * Custom ID to identify the new DataTable instance.
     */
    id?: string;

    /**
     * A reference to the specific data table key defined in the component's
     * connector options.
     */
    key?: string;

    /**
     * Metadata to describe the dataTable.
     */
    metadata?: Record<string, DataTableValue>;
}


export type DataTableValue = (boolean|null|number|string|undefined);


/* *
 *
 *  Default Export
 *
 * */


export default DataTableOptions;

/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 *  Authors:
 *  - Sophie Bremer
 *  - Dawid Draguła
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

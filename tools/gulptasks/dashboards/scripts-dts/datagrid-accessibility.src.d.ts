/*!*
 *
 *  Copyright (c) Highsoft AS. All rights reserved.
 *
 *!*/

import * as _DataGrid from "../datagrid.src";

import _DataGridAccessibility from "../es-modules/DataGrid/DataGridAccessibility";

import "../es-modules/DataGrid/DataGridAccessibility";

declare module "../datagrid.src" {
    const DataGridAccessibility: typeof _DataGridAccessibility
}

/**
 * Adds the module to the imported Dashboards namespace.
 *
 * @param datagrid
 * The imported Dashboards namespace to extend.
 */
declare function factory(datagrid: typeof _DataGrid): void;

export let DataGrid: typeof _DataGrid;

export default factory;
/* *
 *
 *  (c) 2009 - 2023 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Sebastian Bochan
 *  - Wojciech Chmiel
 *  - Gøran Slettemark
 *  - Sophie Bremer
 *  - Pawel Lysy
 *  - Karol Kolodziej
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */


/* *
 *
 *  Namespace
 *
 * */

/**
 * Global DataGrid namespace.
 *
 * @namespace DataGrid
 */
namespace Globals {

    /* *
     *
     *  Declarations
     *
     * */

    /**
     * Utility type to mark recursively all properties and sub-properties
     * optional.
     */
    export type DeepPartial<T> = {
        [K in keyof T]?: (T[K]|DeepPartial<T[K]>);
    };

    /* *
     *
     *  Constants
     *
     * */

    export const classNamePrefix = 'highcharts-datagrid-';

    export const classNames = {
        gridContainer: classNamePrefix + 'container',
        outerContainer: classNamePrefix + 'outer-container',
        scrollContainer: classNamePrefix + 'scroll-container',
        innerContainer: classNamePrefix + 'inner-container',
        cell: classNamePrefix + 'cell',
        cellInput: classNamePrefix + 'cell-input',
        row: classNamePrefix + 'row',
        columnHeader: classNamePrefix + 'column-header'
    };

    export const win = window;

}

/* *
 *
 *  Default Export
 *
 * */

export default Globals;

/* *
 *
 *  (c) 2009-2024 Highsoft AS
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

    /**
     * Utility type to mark recursively all properties and sub-properties
     * required.
     */
    export type DeepRequired<T> = {
        [K in keyof T]-?: DeepRequired<T[K]>;
    };

    /* *
     *
     *  Constants
     *
     * */

    export const classNamePrefix = 'highcharts-dg-';

    export const classNames = {
        container: classNamePrefix + 'container',
        tableElement: classNamePrefix + 'table',
        titleElement: classNamePrefix + 'title',
        theadElement: classNamePrefix + 'thead',
        tbodyElement: classNamePrefix + 'tbody',
        rowElement: classNamePrefix + 'row',
        columnElement: classNamePrefix + 'column',
        hoveredCell: classNamePrefix + 'hovered-cell',
        hoveredColumn: classNamePrefix + 'hovered-column',
        hoveredRow: classNamePrefix + 'hovered-row',
        odd: classNamePrefix + 'odd',
        noResultColumn: classNamePrefix + 'no-result-column',
        rowsContentNowrap: classNamePrefix + 'rows-content-nowrap',
        headCellContent: classNamePrefix + 'head-cell-content',
        headCellResized: classNamePrefix + 'head-cell-resized'
    };

    export const win = window;
    export const userAgent = (win.navigator && win.navigator.userAgent) || '';
    export const isChrome = userAgent.indexOf('Chrome') !== -1;
    export const isSafari = !isChrome && userAgent.indexOf('Safari') !== -1;

}

/* *
 *
 *  Default Export
 *
 * */

export default Globals;

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

    /* *
     *
     *  Constants
     *
     * */

    export const classNamePrefix = 'highcharts-datagrid-';

    export const classNames = {
        tableElement: classNamePrefix + 'table',
        theadElement: classNamePrefix + 'thead',
        tbodyElement: classNamePrefix + 'tbody'
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

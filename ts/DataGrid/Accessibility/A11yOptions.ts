/* *
 *
 *  DataGrid Accessibility options
 *
 *  (c) 2020-2024 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Dawid Dragula
 *  - Sebastian Bochan
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
 *  Declarations
 *
 * */

namespace A11yOptions {

    /**
     * Accessibility options for the DataGrid.
     */
    export interface GeneralA11yOptions {
        /**
         * Enable accessibility features for the DataGrid.
         * 
         * @default true
         */
        enabled?: boolean;
    }

    /**
     * Accessibility language options for the DataGrid.
     */
    export interface LangAccessibilityOptions {
        /**
         * Language options for the accessibility descriptions in cell editing.
         */
        cellEditing?: CellEditingLangA11yOptions;
        /**
         * Language options for the accessibility descriptions in sorting.
         */
        sorting?: SortingLangA11yOptions;
    }

    /**
     * Accessibility options for the DataGrid cell editing functionality.
     */
    export interface CellEditingLangA11yOptions {
        editable?: string;
        announcements?: {
            enabled?: boolean;
            started?: string;
            edited?: string;
            cancelled?: string;
        }
    }

    /**
     * Accessibility options for the DataGrid sorting functionality.
     */
    export interface SortingLangA11yOptions {
        sortable?: string;
        announcements?: {
            enabled?: boolean;
            ascending?: string;
            descending?: string;
            none?: string;
        }
    }

    /**
     * Accessibility options for the DataGrid header cell.
     */
    export interface HeaderCellA11yOptions {
        description?: string;
    }

}


/* *
 *
 *  Default Export
 *
 * */

export default A11yOptions;

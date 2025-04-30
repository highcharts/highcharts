/* *
 *
 *  Cell Renderer abstract class
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

import type Column from '../../Core/Table/Column';
import type TableCell from '../../Core/Table/Body/TableCell';
import type CellContent from '../../Core/Table/CellContent/CellContent';
import type { CellEventCallback } from '../GridEvents';

/* *
 *
 *  Class
 *
 * */

/**
 * Renderer class that initialize all options per column.
 */
abstract class CellRenderer {

    public abstract options: CellRenderer.Options;

    public readonly column: Column;

    public constructor(column: Column) {
        this.column = column;
    }

    /**
     * Render the cell content.
     */
    public abstract render(cell: TableCell): CellContent;
}


/* *
 *
 *  Namespace
 *
 * */

namespace CellRenderer {

    export interface Options {
        /**
         * The cell content type.
         */
        type: string;
        events?: TypeEvents
    }

    interface TypeEvents {
        change?: CellEventCallback;
    }

}


/* *
 *
 *  Default Export
 *
 * */

export default CellRenderer;

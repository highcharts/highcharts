/* *
 *
 *  Cell Renderer abstract class
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 *  Authors:
 *  - Dawid Draguła
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

/* *
 *
 *  Class
 *
 * */

/**
 * Renderer class that initialize all options per column.
 */
export abstract class CellRenderer {

    /**
     * Options to control the renderer content.
     */
    public abstract options: CellRendererOptions;

    /**
     * The column to which the specific renderer belongs.
     */
    public readonly column: Column;

    /**
     * Constructs the CellRenderer instance.
     *
     * @param column
     * The column of the cell.
     *
     */
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

/**
 * Options to control the renderer content.
 */
export interface CellRendererOptions {
    /**
     * The cell content type.
     *
     * Can be one of the following: `'text'`, `'checkbox'`, `'select'`,
     * `'textInput'`, `'dateInput'`, `'dateTimeInput'`, `'timeInput'`,
     * `'numberInput'`, `'sparkline'`.
     *
     * You can also create your own custom renderer by extending the
     * `CellRenderer` class and registering it in the
     * `CellRendererTypeRegistry`.
     *
     * @default 'text'
     */
    type: string;
}


/* *
 *
 *  Default Export
 *
 * */

export default CellRenderer;

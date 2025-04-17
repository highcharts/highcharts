/* *
 *
 *  Text Cell Renderer abstract class
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

import TableCell from '../Body/TableCell.js';
import CellContentRenderer from './CellContentRenderer.js';

import GridUtils from '../../GridUtils.js';
const {
    setHTMLContent
} = GridUtils;

import Utils from '../../../../Core/Utilities.js';
const {
    defined
} = Utils;


/* *
 *
 *  Class
 *
 * */

class TextRenderer extends CellContentRenderer {

    /**
     * Render the cell content.
     * 
     * @param cell
     * The cell to render the content for.
     */
    public override render(cell: TableCell): void {
        setHTMLContent(cell.htmlElement, this.format(cell));
    }

    /**
     * Returns the formatted value of the cell.
     * 
     * @param cell
     * The cell to format the content for.
     *
     * @internal
     */
    private format(cell: TableCell): string {
        const cellsDefaults =
            cell.row.viewport.grid.options?.columnDefaults?.cells || {};
        const options = cell.column.options.cells || {};
        const { format, formatter } = options;
        const isDefaultFormat = cellsDefaults.format === format;
        const isDefaultFormatter = cellsDefaults.formatter === formatter;

        let value = cell.value;
        if (!defined(value)) {
            value = '';
        }

        let cellContent = '';

        if (isDefaultFormat && isDefaultFormatter) {
            cellContent = formatter ?
                formatter.call(cell).toString() :
                (
                    format ? cell.format(format) : value + ''
                );
        } else if (isDefaultFormat) {
            cellContent = formatter?.call(cell).toString() || value + '';
        } else if (isDefaultFormatter) {
            cellContent = format ? cell.format(format) : value + '';
        }

        return cellContent;
    }

}


/* *
 *
 *  Default Export
 *
 * */

export default TextRenderer;

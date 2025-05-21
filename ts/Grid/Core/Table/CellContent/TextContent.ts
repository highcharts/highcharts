/* *
 *
 *  Text Cell Renderer class
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

import type Column from '../Column';

import AST from '../../../../Core/Renderer/HTML/AST.js';
import CellContent from './CellContent.js';

import GridUtils from '../../GridUtils.js';
const {
    setHTMLContent
} = GridUtils;

import Utils from '../../../../Core/Utilities.js';
import TableCell from '../Body/TableCell';
const {
    defined
} = Utils;


/* *
 *
 *  Class
 *
 * */

/**
 * Represents a text type of content.
 */
class TextContent extends CellContent {

    constructor(cell: TableCell, parent?: HTMLElement) {
        super(cell, parent);
        this.add();
    }

    protected override add(): void {
        setHTMLContent(this.parentElement, this.format());
    }

    public override destroy(): void {
        this.parentElement.innerHTML = AST.emptyHTML;
    }

    /**
     * Returns the formatted value of the cell.
     *
     * @param cell
     * The cell to format the content for.
     *
     * @internal
     */
    private format(): string {
        const { cell } = this;
        const cellsDefaults =
            cell.row.viewport.grid.options?.columnDefaults?.cells || {};
        const { format, formatter } = cell.column.options.cells || {};

        let value = cell.value;
        if (!defined(value)) {
            value = '';
        }

        let cellContent = '';

        if (!format && !formatter) {
            return cell.format(
                TextContent.defaultFormatsForDataTypes[cell.column.dataType]
            );
        }

        const isDefaultFormat = cellsDefaults.format === format;
        const isDefaultFormatter = cellsDefaults.formatter === formatter;

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
 *  Namespace
 *
 * */

namespace TextContent {

    /**
     * Default formats for data types.
     */
    export const defaultFormatsForDataTypes: Record<Column.DataType, string> = {
        string: '{value}',
        number: '{value}',
        boolean: '{value}',
        date: '{value:%Y-%m-%d %H:%M:%S}'
    };
}

/* *
 *
 *  Default Export
 *
 * */

export default TextContent;

/* *
 *
 *  Text Cell Content class
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
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

import type { ColumnDataType } from '../Column';

import AST from '../../../../Core/Renderer/HTML/AST.js';
import CellContent from './CellContent.js';
import TableCell from '../Body/TableCell';

import GridUtils from '../../GridUtils.js';
const {
    setHTMLContent
} = GridUtils;

import Utils from '../../../../Core/Utilities.js';
const {
    defined,
    isString
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

    /* *
     *
     *  Static Properties
     *
     * */

    public static readonly defaultFormatsForDataTypes: Record<ColumnDataType, string> = {
        string: '{value}',
        number: '{value:,.f}',
        'boolean': '{value}',
        datetime: '{value:%Y-%m-%d %H:%M:%S}'
    };


    /* *
     *
     *  Constructor
     *
     * */

    constructor(cell: TableCell) {
        super(cell);
        this.add();
    }


    /* *
     *
     *  Methods
     *
     * */

    protected override add(): void {
        this.update();
    }

    public override destroy(): void {
        this.cell.htmlElement.innerHTML = AST.emptyHTML;
    }

    public override update(): void {
        setHTMLContent(this.cell.htmlElement, this.format());
    }

    /**
     * Returns the formatted value of the cell.
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
            const formattedValue = formatter?.call(cell);

            if (isString(formattedValue)) {
                cellContent = formattedValue;
            } else {
                cellContent = value + '';
            }

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

export default TextContent;

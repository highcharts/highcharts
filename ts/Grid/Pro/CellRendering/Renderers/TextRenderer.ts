/* *
 *
 *  Text Cell Renderer class
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

import type { Column, ColumnDataType } from '../../../Core/Table/Column';
import type TableCell from '../../../Core/Table/Body/TableCell';
import type {
    EditModeRendererTypeName
} from '../../CellEditing/CellEditingComposition';

import { CellRenderer, CellRendererOptions } from '../CellRenderer.js';
import { registerRenderer } from '../CellRendererRegistry.js';
import TextContent from '../../../Core/Table/CellContent/TextContent.js';

import U from '../../../../Core/Utilities.js';
const {
    merge
} = U;


/* *
 *
 *  Class
 *
 * */

/**
 * Renderer for the Text in a column..
 */
class TextRenderer extends CellRenderer {

    /**
     * The default edit mode renderer type names for this view renderer.
     */
    public static defaultEditingRenderer: Record<
        ColumnDataType, EditModeRendererTypeName
    > = {
            string: 'textInput',
            number: 'numberInput',
            'boolean': 'checkbox',
            datetime: 'dateInput'
        };

    /**
     * Default options for the text renderer.
     */
    public static defaultOptions: TextRendererOptions = {
        type: 'text'
    };

    public override options: TextRendererOptions;

    /**
     * The format to use for the text content.
     */
    public format?: string;

    /**
     * Formatter function for the text content.
     */
    public formatter?: (this: TableCell) => string;


    /* *
     *
     *  Constructor
     *
     * */

    constructor(column: Column) {
        super(column);

        this.options = merge(
            TextRenderer.defaultOptions,
            this.column.options.cells?.renderer || {}
        );

        const cellOptions = column.options.cells;

        this.format =
            cellOptions?.format ??
            TextContent.defaultFormatsForDataTypes[column.dataType];

        this.formatter = cellOptions?.formatter;
    }


    /* *
     *
     *  Methods
     *
     * */

    public override render(cell: TableCell): TextContent {
        return new TextContent(cell);
    }
}


/* *
 *
 *  Declarations
 *
 * */

/**
 * Options to control the text renderer content.
 */
export interface TextRendererOptions extends CellRendererOptions {
    type: 'text';
}


/* *
 *
 *  Registry
 *
 * */

declare module '../CellRendererType' {
    interface CellRendererTypeRegistry {
        text: typeof TextRenderer;
    }
}

registerRenderer('text', TextRenderer);


/* *
 *
 *  Default Export
 *
 * */

export default TextRenderer;

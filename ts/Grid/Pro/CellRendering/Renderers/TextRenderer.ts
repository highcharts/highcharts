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

import type Column from '../../../Core/Table/Column';
import type TableCell from '../../../Core/Table/Body/TableCell';
import type {
    EditModeRendererTypeName
} from '../../CellEditing/CellEditingComposition';

import CellRenderer from '../CellRenderer.js';
import CellRendererRegistry from '../CellRendererRegistry.js';
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
        Column.DataType, EditModeRendererTypeName
    > = {
            string: 'textInput',
            number: 'numberInput',
            'boolean': 'checkbox',
            datetime: 'dateInput'
        };

    /**
     * Default options for the text renderer.
     */
    public static defaultOptions: TextRenderer.Options = {
        type: 'text'
    };

    public override options: TextRenderer.Options;

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
 *  Namespace
 *
 * */

namespace TextRenderer {

    /**
     * Options to control the text renderer content.
     */
    export interface Options extends CellRenderer.Options {
        type: 'text';
    }

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

CellRendererRegistry.registerRenderer('text', TextRenderer);


/* *
 *
 *  Default Export
 *
 * */

export default TextRenderer;

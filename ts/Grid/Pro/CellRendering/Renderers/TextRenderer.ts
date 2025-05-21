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

    public static defaultEditingRenderer: EditModeRendererTypeName = 'textInput';
    public static defaultOptions: TextRenderer.Options = {
        type: 'text'
    };

    public override options: TextRenderer.Options;

    public format?: string;
    public formatter?: (this: TableCell) => string;

    constructor(column: Column) {
        super(column);

        this.options = merge(
            this.column.options.renderer || {},
            TextRenderer.defaultOptions
        );

        const cellOptions = column.options.cells;

        this.format =
            cellOptions?.format ??
            TextContent.defaultFormatsForDataTypes[column.dataType];

        this.formatter = cellOptions?.formatter;
    }

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

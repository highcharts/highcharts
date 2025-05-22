/* *
 *
 *  Text Input Cell Renderer class
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

import CellRenderer from '../CellRenderer.js';
import CellRendererRegistry from '../CellRendererRegistry.js';
import TextInputContent from '../ContentTypes/TextInputContent.js';

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
 * Renderer for the Select in a column..
 */
class TextInputRenderer extends CellRenderer {

    public static defaultOptions: TextInputRenderer.Options = {
        type: 'textInput'
    };

    
    public override options: TextInputRenderer.Options;

    public constructor(column: Column) {
        super(column);

        this.options = merge(
            this.column.options.renderer || {},
            TextInputRenderer.defaultOptions
        );
    }

    public override render(cell: TableCell): TextInputContent {
        return new TextInputContent(cell);
    }

}


/* *
 *
 *  Namespace
 *
 * */

namespace TextInputRenderer {
    export interface Options extends CellRenderer.Options {
        type: 'textInput';
    }
}


/* *
 *
 *  Registry
 *
 * */

declare module '../CellRendererType' {
    interface CellRendererTypeRegistry {
        textInput: typeof TextInputRenderer
    }
}

CellRendererRegistry.registerRenderer('textInput', TextInputRenderer);


/* *
 *
 *  Default Export
 *
 * */

export default TextInputRenderer;

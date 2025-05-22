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
import { EditModeRenderer } from '../../CellEditing/CellEditMode';
import type {
    EditModeRendererTypeName
} from '../../CellEditing/CellEditingComposition';

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
class TextInputRenderer extends CellRenderer implements EditModeRenderer {

    public static defaultEditingRenderer: EditModeRendererTypeName =
        'textInput';

    public static defaultOptions: TextInputRenderer.Options = {
        type: 'textInput'
    };

    
    public override options: TextInputRenderer.Options;

    public constructor(column: Column, options: Partial<CellRenderer.Options>) {
        super(column);
        this.options = merge(TextInputRenderer.defaultOptions, options);
    }

    public override render(cell: TableCell): TextInputContent {
        return new TextInputContent(cell, this);
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

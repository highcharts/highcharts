/* *
 *
 *  Text Input Cell Renderer class
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 *  Authors:
 *  - Dawid Dragula
 *  - Sebastian Bochan
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

import { CellRenderer, CellRendererOptions } from '../CellRenderer.js';
import { registerRenderer } from '../CellRendererRegistry.js';
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

    /**
     * The default edit mode renderer type names for this view renderer.
     */
    public static defaultEditingRenderer: EditModeRendererTypeName =
        'textInput';

    /**
     * Default options for the text input renderer.
     */
    public static defaultOptions: TextInputRendererOptions = {
        type: 'textInput'
    };

    public override options: TextInputRendererOptions;


    /* *
     *
     *  Constructor
     *
     * */

    public constructor(column: Column, options: Partial<CellRendererOptions>) {
        super(column);
        this.options = merge(TextInputRenderer.defaultOptions, options);
    }


    /* *
     *
     *  Methods
     *
     * */

    public override render(
        cell: TableCell,
        parentElement?: HTMLElement
    ): TextInputContent {
        return new TextInputContent(cell, this, parentElement);
    }

}


/* *
 *
 *  Declarations
 *
 * */

/**
 * Options to control the text input renderer content.
 */
export interface TextInputRendererOptions extends CellRendererOptions {
    type: 'textInput';

    /**
     * Whether the text input is disabled.
     */
    disabled?: boolean;

    /**
     * Attributes to control the text input.
     */
    attributes?:TextInputAttributes;
}

/**
 * Attributes to control the text input.
 */
export interface TextInputAttributes {
    minlength?: number;
    maxlength?: number;
    pattern?: string;
    placeholder?: string;
    size?: number;
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

registerRenderer('textInput', TextInputRenderer);


/* *
 *
 *  Default Export
 *
 * */

export default TextInputRenderer;

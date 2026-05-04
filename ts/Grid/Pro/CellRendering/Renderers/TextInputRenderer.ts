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
 *  - Dawid Draguła
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
import { merge } from '../../../../Shared/Utilities.js';

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
    /**
     * Use the built-in text input renderer.
     *
     * @default 'textInput'
     */
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
    /**
     * Minimum number of characters allowed in the input.
     */
    minlength?: number;

    /**
     * Maximum number of characters allowed in the input.
     */
    maxlength?: number;

    /**
     * Regular expression pattern used for native input validation.
     */
    pattern?: string;

    /**
     * Placeholder text shown when the input is empty.
     */
    placeholder?: string;

    /**
     * Visible width of the input in characters.
     */
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

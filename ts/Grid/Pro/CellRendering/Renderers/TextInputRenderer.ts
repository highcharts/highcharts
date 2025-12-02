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

    /**
     * The default edit mode renderer type names for this view renderer.
     */
    public static defaultEditingRenderer: EditModeRendererTypeName =
        'textInput';

    /**
     * Default options for the text input renderer.
     */
    public static defaultOptions: TextInputRenderer.Options = {
        type: 'textInput'
    };

    public override options: TextInputRenderer.Options;


    /* *
     *
     *  Constructor
     *
     * */

    public constructor(column: Column, options: Partial<CellRenderer.Options>) {
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
 *  Namespace
 *
 * */

namespace TextInputRenderer {

    /**
     * Options to control the text input renderer content.
     */
    export interface Options extends CellRenderer.Options {
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

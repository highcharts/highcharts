/* *
 *
 *  Date Input Cell Renderer class
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 *  Authors:
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
import type { EditModeRenderer } from '../../CellEditing/CellEditMode';
import type {
    EditModeRendererTypeName
} from '../../CellEditing/CellEditingComposition';

import { CellRenderer, CellRendererOptions } from '../CellRenderer.js';
import { registerRenderer } from '../CellRendererRegistry.js';
import NumberInputContent from '../ContentTypes/NumberInputContent.js';

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
class NumberInputRenderer extends CellRenderer implements EditModeRenderer {

    /**
     * The default edit mode renderer type name for this view renderer.
     */
    public static defaultEditingRenderer: EditModeRendererTypeName =
        'numberInput';

    /**
     * Default options for the date input renderer.
     */
    public static defaultOptions: NumberInputRendererOptions = {
        type: 'numberInput'
    };

    public override options: NumberInputRendererOptions;


    /* *
     *
     *  Constructor
     *
     * */

    public constructor(column: Column, options: Partial<CellRendererOptions>) {
        super(column);
        this.options = merge(NumberInputRenderer.defaultOptions, options);
    }


    /* *
     *
     *  Methods
     *
     * */

    public override render(
        cell: TableCell,
        parentElement?: HTMLElement
    ): NumberInputContent {
        return new NumberInputContent(cell, this, parentElement);
    }

}


/* *
 *
 *  Declarations
 *
 * */

/**
 * Options to control the number input renderer content.
 */
export interface NumberInputRendererOptions extends CellRendererOptions {
    type: 'numberInput';

    /**
     * Whether the number input is disabled.
     */
    disabled?: boolean;

    /**
     * Attributes to control the number input.
     */
    attributes?: NumberInputAttributes;
}

/**
 * Attributes to control the number input.
 */
export interface NumberInputAttributes {
    min?: number;
    max?: number;
    step?: number;
}


/* *
 *
 *  Registry
 *
 * */

declare module '../CellRendererType' {
    interface CellRendererTypeRegistry {
        numberInput: typeof NumberInputRenderer
    }
}

registerRenderer('numberInput', NumberInputRenderer);


/* *
 *
 *  Default Export
 *
 * */

export default NumberInputRenderer;

/* *
 *
 *  Date Input Cell Renderer class
 *
 *  (c) 2020-2025 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
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

import CellRenderer from '../CellRenderer.js';
import CellRendererRegistry from '../CellRendererRegistry.js';
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
    public static defaultOptions: NumberInputRenderer.Options = {
        type: 'numberInput'
    };

    public override options: NumberInputRenderer.Options;


    /* *
     *
     *  Constructor
     *
     * */

    public constructor(column: Column, options: Partial<CellRenderer.Options>) {
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
 *  Namespace
 *
 * */

namespace NumberInputRenderer {

    /**
     * Options to control the number input renderer content.
     */
    export interface Options extends CellRenderer.Options {
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

CellRendererRegistry.registerRenderer('numberInput', NumberInputRenderer);


/* *
 *
 *  Default Export
 *
 * */

export default NumberInputRenderer;

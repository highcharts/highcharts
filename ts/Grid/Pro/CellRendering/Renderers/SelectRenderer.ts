/* *
 *
 *  Select Cell Renderer class
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
import type { EditModeRenderer } from '../../CellEditing/CellEditMode';
import type {
    EditModeRendererTypeName
} from '../../CellEditing/CellEditingComposition';

import { CellRenderer, CellRendererOptions } from '../CellRenderer.js';
import { registerRenderer } from '../CellRendererRegistry.js';
import SelectContent from '../ContentTypes/SelectContent.js';

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
class SelectRenderer extends CellRenderer implements EditModeRenderer {

    /**
     * The default edit mode renderer type name for this view renderer.
     */
    public static defaultEditingRenderer: EditModeRendererTypeName = 'select';

    /**
     * Default options for the select renderer.
     */
    public static defaultOptions: SelectRendererOptions = {
        type: 'select',
        options: []
    };

    public override options: SelectRendererOptions;


    /* *
     *
     *  Constructor
     *
     * */

    public constructor(column: Column, options: Partial<CellRendererOptions>) {
        super(column);
        this.options = merge(SelectRenderer.defaultOptions, options);
    }


    /* *
     *
     *  Methods
     *
     * */

    public override render(
        cell: TableCell,
        parentElement?: HTMLElement
    ): SelectContent {
        return new SelectContent(cell, this, parentElement);
    }

}


/* *
 *
 *  Declarations
 *
 * */

/**
 * Options to define a single select option.
 */
export interface SelectOption {
    /**
     * The value of the option.
     */
    value: string;

    /**
     * The label of the option.
     */
    label?: string;

    /**
     * Whether the option is disabled. If true, the option cannot be
     * selected.
     */
    disabled?: boolean;
}

/**
 * Options to control the select renderer content.
 */
export interface SelectRendererOptions extends CellRendererOptions {
    type: 'select';

    /**
     * The options available in the select input.
     */
    options: SelectOption[];

    /**
     * Whether the select input is disabled.
     */
    disabled?: boolean;

    /**
     * Attributes to control the select input.
     */
    attributes?: SelectAttributes;
}

/**
 * Attributes to control the select input.
 */
export interface SelectAttributes {
    multiple?: boolean;
    autofocus?: boolean;
    size?: number;
}


/* *
 *
 *  Registry
 *
 * */

declare module '../CellRendererType' {
    interface CellRendererTypeRegistry {
        select: typeof SelectRenderer
    }
}

registerRenderer('select', SelectRenderer);


/* *
 *
 *  Default Export
 *
 * */

export default SelectRenderer;

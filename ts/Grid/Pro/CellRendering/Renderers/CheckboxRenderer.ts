/* *
 *
 *  Checkbox Cell Renderer class
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
import type { EditModeRenderer } from '../../CellEditing/CellEditMode';
import type TableCell from '../../../Core/Table/Body/TableCell';
import type {
    EditModeRendererTypeName
} from '../../CellEditing/CellEditingComposition';

import { CellRenderer, CellRendererOptions } from '../CellRenderer.js';
import { registerRenderer } from '../CellRendererRegistry.js';
import CheckboxContent from '../ContentTypes/CheckboxContent.js';

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
 * Renderer for the Checkbox in a column.
 */
class CheckboxRenderer extends CellRenderer implements EditModeRenderer {

    /**
     * The default edit mode renderer type name for this view renderer.
     */
    public static defaultEditingRenderer: EditModeRendererTypeName = 'checkbox';

    /**
     * Default options for the checkbox renderer.
     */
    public static defaultOptions: CheckboxRendererOptions = {
        type: 'checkbox'
    };

    public override options: CheckboxRendererOptions;


    /* *
     *
     *  Constructor
     *
     * */

    public constructor(column: Column, options: Partial<CellRendererOptions>) {
        super(column);
        this.options = merge(CheckboxRenderer.defaultOptions, options);
    }


    /* *
     *
     *  Methods
     *
     * */

    public override render(
        cell: TableCell,
        parentElement?: HTMLElement
    ): CheckboxContent {
        return new CheckboxContent(cell, this, parentElement);
    }
}


/* *
 *
 *  Declarations
 *
 * */

/**
 * Options to control the checkbox renderer content.
 */
export interface CheckboxRendererOptions extends CellRendererOptions {
    type: 'checkbox';

    /**
     * Whether the checkbox is disabled.
     */
    disabled?: boolean;

    /**
     * Attributes to control the checkbox.
     */
    attributes?: CheckboxAttributes;
}

/**
 * Attributes to control the checkbox.
 */
export interface CheckboxAttributes {
    checked?: boolean;
}


/* *
 *
 *  Registry
 *
 * */

declare module '../CellRendererType' {
    interface CellRendererTypeRegistry {
        checkbox: typeof CheckboxRenderer
    }
}

registerRenderer('checkbox', CheckboxRenderer);


/* *
 *
 *  Default Export
 *
 * */

export default CheckboxRenderer;

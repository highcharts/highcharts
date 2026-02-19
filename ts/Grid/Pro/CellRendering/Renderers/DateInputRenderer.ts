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
import type { DateInputRendererBaseOptions } from './DateInputRendererBase';
import type TableCell from '../../../Core/Table/Body/TableCell';
import type { EditModeRenderer } from '../../CellEditing/CellEditMode';
import type {
    EditModeRendererTypeName
} from '../../CellEditing/CellEditingComposition';

import { CellRenderer, CellRendererOptions } from '../CellRenderer.js';
import { registerRenderer } from '../CellRendererRegistry.js';
import DateInputContent from '../ContentTypes/DateInputContent.js';

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
class DateInputRenderer extends CellRenderer implements EditModeRenderer {

    /**
     * The default edit mode renderer type name for this view renderer.
     */
    public static defaultEditingRenderer: EditModeRendererTypeName =
        'dateInput';

    /**
     * Default options for the date input renderer.
     */
    public static defaultOptions: DateInputRendererOptions = {
        type: 'dateInput'
    };

    public override options: DateInputRendererOptions;


    /* *
     *
     *  Constructor
     *
     * */

    public constructor(column: Column, options: Partial<CellRendererOptions>) {
        super(column);
        this.options = merge(DateInputRenderer.defaultOptions, options);
    }


    /* *
     *
     *  Methods
     *
     * */

    public override render(
        cell: TableCell,
        parentElement?: HTMLElement
    ): DateInputContent {
        return new DateInputContent(cell, this, parentElement);
    }

}


/* *
 *
 *  Declarations
 *
 * */

/**
 * Options to control the date input renderer content.
 */
export interface DateInputRendererOptions extends DateInputRendererBaseOptions {
    type: 'dateInput';
}


/* *
 *
 *  Registry
 *
 * */

declare module '../CellRendererType' {
    interface CellRendererTypeRegistry {
        dateInput: typeof DateInputRenderer
    }
}

registerRenderer('dateInput', DateInputRenderer);


/* *
 *
 *  Default Export
 *
 * */

export default DateInputRenderer;

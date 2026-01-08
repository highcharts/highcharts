/* *
 *
 *  Date Time Input Cell Renderer class
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
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
import type { DateInputRendererBaseOptions } from './DateInputRendererBase';
import type TableCell from '../../../Core/Table/Body/TableCell';
import type { EditModeRenderer } from '../../CellEditing/CellEditMode';
import type {
    EditModeRendererTypeName
} from '../../CellEditing/CellEditingComposition';

import { CellRenderer, CellRendererOptions } from '../CellRenderer.js';
import { registerRenderer } from '../CellRendererRegistry.js';
import DateTimeInputContent from '../ContentTypes/DateTimeInputContent.js';

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
class DateTimeInputRenderer extends CellRenderer implements EditModeRenderer {

    /**
     * The default edit mode renderer type name for this view renderer.
     */
    public static defaultEditingRenderer: EditModeRendererTypeName =
        'dateTimeInput';

    /**
     * Default options for the date input renderer.
     */
    public static defaultOptions: DateTimeInputRendererOptions = {
        type: 'dateTimeInput'
    };

    public override options: DateTimeInputRendererOptions;


    /* *
     *
     *  Constructor
     *
     * */

    public constructor(column: Column, options: Partial<CellRendererOptions>) {
        super(column);
        this.options = merge(DateTimeInputRenderer.defaultOptions, options);
    }


    /* *
     *
     *  Methods
     *
     * */

    public override render(
        cell: TableCell,
        parentElement?: HTMLElement
    ): DateTimeInputContent {
        return new DateTimeInputContent(cell, this, parentElement);
    }

}


/* *
 *
 *  Declarations
 *
 * */

/**
 * Options to control the date time input renderer content.
 */
export interface DateTimeInputRendererOptions
    extends DateInputRendererBaseOptions {

    type: 'dateTimeInput';
}


/* *
 *
 *  Registry
 *
 * */

declare module '../CellRendererType' {
    interface CellRendererTypeRegistry {
        dateTimeInput: typeof DateTimeInputRenderer
    }
}

registerRenderer('dateTimeInput', DateTimeInputRenderer);


/* *
 *
 *  Default Export
 *
 * */

export default DateTimeInputRenderer;

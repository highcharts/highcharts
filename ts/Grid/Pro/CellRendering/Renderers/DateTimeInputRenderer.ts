/* *
 *
 *  Date Time Input Cell Renderer class
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
import type DateInputRendererBase from './DateInputRendererBase';
import type TableCell from '../../../Core/Table/Body/TableCell';
import type { EditModeRenderer } from '../../CellEditing/CellEditMode';
import type {
    EditModeRendererTypeName
} from '../../CellEditing/CellEditingComposition';

import CellRenderer from '../CellRenderer.js';
import CellRendererRegistry from '../CellRendererRegistry.js';
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
    public static defaultOptions: DateTimeInputRenderer.Options = {
        type: 'dateTimeInput'
    };

    public override options: DateTimeInputRenderer.Options;


    /* *
     *
     *  Constructor
     *
     * */

    public constructor(column: Column, options: Partial<CellRenderer.Options>) {
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
 *  Namespace
 *
 * */

namespace DateTimeInputRenderer {

    /**
     * Options to control the date input renderer content.
     */
    export interface Options extends DateInputRendererBase.Options {
        type: 'dateTimeInput';
    }
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

CellRendererRegistry.registerRenderer('dateTimeInput', DateTimeInputRenderer);


/* *
 *
 *  Default Export
 *
 * */

export default DateTimeInputRenderer;

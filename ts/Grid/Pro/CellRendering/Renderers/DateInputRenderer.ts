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
import type TableCell from '../../../Core/Table/Body/TableCell';
import type { EditModeRenderer } from '../../CellEditing/CellEditMode';
import type {
    EditModeRendererTypeName
} from '../../CellEditing/CellEditingComposition';

import CellRenderer from '../CellRenderer.js';
import CellRendererRegistry from '../CellRendererRegistry.js';
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
    public static defaultOptions: DateInputRenderer.Options = {
        type: 'dateInput'
    };

    public override options: DateInputRenderer.Options;


    /* *
     *
     *  Constructor
     *
     * */

    public constructor(column: Column, options: Partial<CellRenderer.Options>) {
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
 *  Namespace
 *
 * */

namespace DateInputRenderer {

    /**
     * Options to control the date input renderer content.
     */
    export interface Options extends CellRenderer.Options {
        type: 'dateInput';

        /**
         * Whether the date input is disabled.
         */
        disabled?: boolean;
    }
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

CellRendererRegistry.registerRenderer('dateInput', DateInputRenderer);


/* *
 *
 *  Default Export
 *
 * */

export default DateInputRenderer;

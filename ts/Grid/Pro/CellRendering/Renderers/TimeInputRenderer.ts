/* *
 *
 *  Time Input Cell Renderer class
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
import TimeInputContent from '../ContentTypes/TimeInputContent.js';

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
class TimeInputRenderer extends CellRenderer implements EditModeRenderer {

    /**
     * The default edit mode renderer type name for this view renderer.
     */
    public static defaultEditingRenderer: EditModeRendererTypeName =
        'timeInput';

    /**
     * Default options for the time input renderer.
     */
    public static defaultOptions: TimeInputRendererOptions = {
        type: 'timeInput'
    };

    public override options: TimeInputRendererOptions;


    /* *
     *
     *  Constructor
     *
     * */

    public constructor(column: Column, options: Partial<CellRendererOptions>) {
        super(column);
        this.options = merge(TimeInputRenderer.defaultOptions, options);
    }


    /* *
     *
     *  Methods
     *
     * */

    public override render(
        cell: TableCell,
        parentElement?: HTMLElement
    ): TimeInputContent {
        return new TimeInputContent(cell, this, parentElement);
    }

}


/* *
 *
 *  Declarations
 *
 * */

/**
 * Options to control the time input renderer content.
 */
export interface TimeInputRendererOptions extends DateInputRendererBaseOptions {
    type: 'timeInput';
}


/* *
 *
 *  Registry
 *
 * */

declare module '../CellRendererType' {
    interface CellRendererTypeRegistry {
        timeInput: typeof TimeInputRenderer
    }
}

registerRenderer('timeInput', TimeInputRenderer);


/* *
 *
 *  Default Export
 *
 * */

export default TimeInputRenderer;

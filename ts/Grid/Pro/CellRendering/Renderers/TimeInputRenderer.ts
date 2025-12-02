/* *
 *
 *  Time Input Cell Renderer class
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
import type TimeInputRendererBase from './DateInputRendererBase';
import type TableCell from '../../../Core/Table/Body/TableCell';
import type { EditModeRenderer } from '../../CellEditing/CellEditMode';
import type {
    EditModeRendererTypeName
} from '../../CellEditing/CellEditingComposition';

import CellRenderer from '../CellRenderer.js';
import CellRendererRegistry from '../CellRendererRegistry.js';
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
    public static defaultOptions: TimeInputRenderer.Options = {
        type: 'timeInput'
    };

    public override options: TimeInputRenderer.Options;


    /* *
     *
     *  Constructor
     *
     * */

    public constructor(column: Column, options: Partial<CellRenderer.Options>) {
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
 *  Namespace
 *
 * */

namespace TimeInputRenderer {

    /**
     * Options to control the time input renderer content.
     */
    export interface Options extends TimeInputRendererBase.Options {
        type: 'timeInput';
    }
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

CellRendererRegistry.registerRenderer('timeInput', TimeInputRenderer);


/* *
 *
 *  Default Export
 *
 * */

export default TimeInputRenderer;

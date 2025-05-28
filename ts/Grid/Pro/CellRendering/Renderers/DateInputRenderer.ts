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

    public static defaultEditingRenderer: EditModeRendererTypeName =
        'dateInput';

    public static defaultOptions: DateInputRenderer.Options = {
        type: 'dateInput'
    };


    public override options: DateInputRenderer.Options;

    public constructor(column: Column, options: Partial<CellRenderer.Options>) {
        super(column);
        this.options = merge(DateInputRenderer.defaultOptions, options);
    }

    public override render(cell: TableCell): DateInputContent {
        return new DateInputContent(cell, this);
    }

}


/* *
 *
 *  Namespace
 *
 * */

namespace DateInputRenderer {
    export interface Options extends CellRenderer.Options {
        type: 'dateInput';
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

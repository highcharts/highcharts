/* *
 *
 *  DateTime Input Cell Content class
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

import type { EditModeContent } from '../../CellEditing/CellEditMode.js';
import type DateTimeInputRenderer from '../Renderers/DateTimeInputRenderer.js';

import DateInputContentBase from './DateInputContentBase.js';


/* *
 *
 *  Class
 *
 * */

/**
 * Represents a datetime input type of cell content.
 */
class DateTimeInputContent extends DateInputContentBase implements EditModeContent {

    public override options!: DateTimeInputRenderer.Options;

    protected override getInputType(): 'datetime-local' {
        return 'datetime-local';
    }

    protected override convertToInputValue(): string {
        return this.cell.column.viewport.grid.time.dateFormat(
            '%Y-%m-%dT%H:%M:%S',
            Number(this.cell.value || 0)
        );
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default DateTimeInputContent;

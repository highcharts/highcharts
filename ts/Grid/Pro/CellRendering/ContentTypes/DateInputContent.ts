/* *
 *
 *  Date Input Cell Content class
 *
 *  (c) 2020-2025 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
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

import type { EditModeContent } from '../../CellEditing/CellEditMode.js';
import type DateInputRenderer from '../Renderers/DateInputRenderer.js';

import DateInputContentBase from './DateInputContentBase.js';


/* *
 *
 *  Class
 *
 * */

/**
 * Represents a date input type of cell content.
 */
class DateInputContent extends DateInputContentBase implements EditModeContent {

    public override options!: DateInputRenderer.Options;

    protected override getInputType(): 'date' {
        return 'date';
    }

    protected override convertToInputValue(): string {
        return this.cell.column.viewport.grid.time.dateFormat(
            '%Y-%m-%d',
            Number(this.cell.value || 0)
        );
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default DateInputContent;

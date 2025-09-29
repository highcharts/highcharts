/* *
 *
 *  Time Input Cell Content class
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
import type TimeInputRenderer from '../Renderers/TimeInputRenderer.js';

import DateInputContentBase from './DateInputContentBase.js';


/* *
 *
 *  Class
 *
 * */

/**
 * Represents a time input type of cell content.
 */
class TimeInputContent extends DateInputContentBase implements EditModeContent {

    public override options!: TimeInputRenderer.Options;

    protected override getInputType(): 'time' {
        return 'time';
    }

    public override get value(): number {
        return new Date(`1970-01-01T${this.input.value}Z`).getTime();
    }

    protected override convertToInputValue(): string {
        return this.cell.column.viewport.grid.time.dateFormat(
            '%H:%M:%S',
            Number(this.cell.value || 0)
        );
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default TimeInputContent;

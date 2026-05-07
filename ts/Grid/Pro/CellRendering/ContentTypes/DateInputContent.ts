/* *
 *
 *  Date Input Cell Content class
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 *  Authors:
 *  - Dawid Draguła
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
import type {
    DateInputRendererOptions
} from '../Renderers/DateInputRenderer.js';

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

    public override options!: DateInputRendererOptions;

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

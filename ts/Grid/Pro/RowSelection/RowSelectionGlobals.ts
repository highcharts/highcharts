/* *
 *
 *  Grid Row Selection globals
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 *  Author:
 *  - Dawid Dragula
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import Globals from '../../Core/Globals.js';


/* *
 *
 *  Constants
 *
 * */

export const selectionColumnId = '__hcgSelection';
export const classNames = {
    rowSelected: Globals.classNamePrefix + 'row-selected',
    selectionCell: Globals.classNamePrefix + 'selection-cell',
    checkbox: Globals.classNamePrefix + 'selection-checkbox',
    checkboxReadonly: Globals.classNamePrefix + 'selection-checkbox-readonly',
    rowsSelectable: Globals.classNamePrefix + 'rows-selectable'
} as const;

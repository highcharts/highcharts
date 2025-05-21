/* *
 *
 *  Grid Cell Editing class.
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


/* *
 *
 *  Imports
 *
 * */

import DataTable from '../../../Data/DataTable';
import TableCell from '../../Core/Table/Body/TableCell';


/* *
 *
 *  Interfaces
 *
 * */

export interface EditModeContent<
T extends DataTable.CellType = DataTable.CellType,
E extends HTMLElement = HTMLElement
> {
    getMainElement(): E;
    getValue(): T;
    destroy(): void;
    blurHandler?: (e: FocusEvent) => void;
    keyDownHandler?: (e: KeyboardEvent) => void;
    changeHandler?: (e: Event) => void;
    finishAfterChange: boolean;
}

export interface EditModeRenderer {
    render(cell: TableCell, parent?: HTMLElement): EditModeContent;
}

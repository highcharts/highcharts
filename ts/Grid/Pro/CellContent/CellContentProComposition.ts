/* *
 *
 *  Cell Content Pro composition
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

import type Column from '../../Core/Table/Column';
import type CellContent from '../../Core/Table/CellContent/CellContent';
import type TableCell from '../../Core/Table/Body/TableCell';

import Globals from '../../Core/Globals.js';
import TextContent from '../../Core/Table/CellContent/TextContent.js';
import CheckboxContent from './CheckboxContent.js';

import U from '../../../Core/Utilities.js';
const {
    pushUnique
} = U;


/* *
 *
 *  Composition
 *
 * */

/**
 * @internal
 */
namespace CellContentProComposition {

    /**
     * Extends the grid classes with cell editing functionality.
     *
     * @param ColumnClass
     * The class to extend.
     */
    export function compose(
        ColumnClass: typeof Column
    ): void {
        if (!pushUnique(Globals.composed, 'CellContentPro')) {
            return;
        }

        ColumnClass.prototype.initCellContent = function (cell: TableCell): CellContent {
            switch (this.dataType) {
                case 'bool': // TODO: add more conditions - e.g. if editable
                    return new CheckboxContent(cell);
                default:
                    return new TextContent(cell);
            }
        }
    }

}


/* *
 *
 *  Default Export
 *
 * */

export default CellContentProComposition;

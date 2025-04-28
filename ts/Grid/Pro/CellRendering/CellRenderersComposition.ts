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
import type CellRendererType from './CellRendererType';
import type TableCell from '../../Core/Table/Body/TableCell';
import type GridUtils from '../../Core/GridUtils';

import CellRendererRegistry from './CellRendererRegistry.js';
import Globals from '../../Core/Globals.js';

import U from '../../../Core/Utilities.js';
const {
    addEvent,
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
namespace CellRenderersComposition {

    /**
     * Extends the grid classes with cell editing functionality.
     *
     * @param ColumnClass
     * The class to extend.
     */
    export function compose(
        ColumnClass: typeof Column
    ): void {
        if (!pushUnique(Globals.composed, 'CellRenderers')) {
            return;
        }

        addEvent(ColumnClass, 'afterInit', afterColumnInit);

        ColumnClass.prototype.createCellContent = createCellContent;
    }

    /**
     * Init a type of content for a column.
     * @param this
     * Current column.
     */
    function afterColumnInit(this: Column): void {
        this.cellRenderer = new CellRendererRegistry.types[
            this.options.rendering?.type ||
            CellRendererRegistry.dataTypeDefaults[this.dataType]
        ](this);
    }

    /**
     * Render content of cell.
     * @param this
     * Current column.
     *
     * @param cell
     * Current cell.
     *
     * @returns
     * Formatted cell content.
     */
    function createCellContent(this: Column, cell: TableCell): CellContent {
        return this.cellRenderer.render(cell);
    }
}

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Options' {
    interface ColumnOptions {
        rendering?: CellRendererType['options'];
    }
}

declare module '../../Core/Table/Column' {
    export default interface Column {
        cellRenderer: CellRendererType;
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default CellRenderersComposition;

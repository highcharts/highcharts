/* *
 *
 *  Cell Content Pro composition
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
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
    const rendererType = this.options.cells?.renderer?.type || 'text';
    let Renderer = CellRendererRegistry.types[rendererType];

    if (!Renderer) {
        // eslint-disable-next-line no-console
        console.warn(`The cell renderer of type "${
            rendererType
        }" is not registered. Using default text renderer instead.`);
        Renderer = CellRendererRegistry.types.text;
    }

    this.cellRenderer = new Renderer(
        this,
        this.options.cells?.renderer || {}
    );
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


/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Options' {
    interface ColumnCellOptions {
        /**
         * Options to control the cell content rendering.
         */
        renderer?: CellRendererType['options'];
    }
}

declare module '../../Core/Table/Column' {
    export default interface Column {
        /**
         * The cell view renderer instance for the column.
         */
        cellRenderer: CellRendererType;
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default {
    compose
} as const;

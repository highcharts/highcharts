/* *
 *
 *  Grid Filtering class
 *
 *  (c) 2020-2025 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Sebastian Bochan
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type HeaderCell from '../../Core/Table/Header/HeaderCell';

import Globals from '../../Core/Globals.js';
import U from '../../../Core/Utilities.js';
import GU from '../../Core/GridUtils.js';

const {
    addEvent,
    pushUnique
} = U;

const {
    makeHTMLElement
} = GU;

/* *
 *
 *  Class Namespace
 *
 * */

namespace FilteringComposition {
    /**
     * The class names used by the filtering functionality.
     */
    export const classNames = {
        colFilterWrapper: Globals.classNamePrefix + 'col-filter-wrapper'
    } as const;

    /**
     * Extends the grid classes with customizable credits.
     *
     * @param HeaderCellClass
     * The class to extend.
     *
     */
    export function compose(
        HeaderCellClass: typeof HeaderCell
    ): void {
        if (!pushUnique(Globals.composed, 'Filtering')) {
            return;
        }

        addEvent(HeaderCellClass, 'afterRender', renderFilteringInput);
    }

    /**
     * Render init in header.
     * @param this
     * Reference to columns's header.
     */
    function renderFilteringInput(this: HeaderCell): void {
        const grid = this.row.viewport.grid;
        const column = this.column;

        if (!column || !this.headerContent) {
            return;
        }

        const inputWrapper = makeHTMLElement('div', {
            className: FilteringComposition.classNames.colFilterWrapper
        }, this.htmlElement);

        this.filterInput = makeHTMLElement('input', {}, inputWrapper);
        this.headerContent.style.paddingBottom =
            this.filterInput.offsetHeight + this.filterInput.offsetTop + 'px';

        addEvent(this.filterInput, 'keyup', (e): void => {
            grid.filterRows(e.target.value, column.id);
        });
    }
}

/* *
 *
 * Declarations
 *
 * */

declare module '../../Core/Table/Header/HeaderCell' {
    export default interface HeaderCell {
        filterInput: HTMLInputElement
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default FilteringComposition;

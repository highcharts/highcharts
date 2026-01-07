/* *
 *
 *  Grid Filter Cell class
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

import type Row from '../../Row.js';
import type Column from '../../Column.js';

import HeaderCell from '../../Header/HeaderCell.js';
import U from '../../../../../Core/Utilities.js';

const { fireEvent } = U;


/* *
 *
 *  Class
 *
 * */

/**
 * Represents a cell in the data grid header.
 */
class FilterCell extends HeaderCell {

    public override column!: Column;


    /* *
     *
     *  Constructor
     *
     * */

    constructor(row: Row, column: Column) {
        const trueHeader = column.header;
        super(row, column);
        column.header = trueHeader;
    }


    /* *
     *
     *  Methods
     *
     * */

    public override render(): void {
        const { column } = this;
        if (!column) {
            return;
        }

        // Render content of th element
        this.row.htmlElement.appendChild(this.htmlElement);

        this.htmlElement.setAttribute('scope', 'col');
        this.htmlElement.setAttribute('data-column-id', column.id);

        // Add user column classname
        if (column.options.className) {
            this.htmlElement.classList.add(
                ...column.options.className.split(/\s+/g)
            );
        }

        this.setCustomClassName(column.options.header?.className);

        fireEvent(this, 'afterRender', { column, filtering: true });
    }

    protected override onKeyDown(e: KeyboardEvent): void {
        this.column.filtering?.onKeyDown(e);

        if (e.target === this.htmlElement) {
            if (e.key === 'Enter') {
                this.column.filtering?.filterSelect?.focus();
            } else {
                super.onKeyDown(e);
            }
        } else {
            if (e.key === 'Escape') {
                this.htmlElement.focus();
            }
        }
    }

    protected override onClick(e: MouseEvent): void {
        if (e.target === this.htmlElement) {
            this.htmlElement.focus();
        }
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default FilterCell;

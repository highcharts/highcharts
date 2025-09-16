/* *
 *
 *  Grid Filter Cell class
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
        const filtering = this.column.filtering;
        if (!filtering) {
            return;
        }

        const contentOrder: HTMLElement[] = [];
        if (filtering.filterInput) {
            contentOrder.push(filtering.filterInput);
        }
        if (filtering.filterSelect) {
            contentOrder.push(filtering.filterSelect);
        }

        if (e.key === 'Enter') {
            const currentIndex = contentOrder.indexOf(e.target as HTMLElement);
            contentOrder[(currentIndex + 1) % contentOrder.length].focus();
            return;
        }

        if (e.target === this.htmlElement) {
            super.onKeyDown(e);
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

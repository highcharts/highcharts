/* *
 *
 *  Grid Summary View
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
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

import type Table from '../../Core/Table/Table';
import type TableRow from '../../Core/Table/Body/TableRow';
import type { RowObject as DataTableRowObject } from '../../../Data/DataTable';

import SummaryTableRow from './SummaryTableRow.js';
import Globals from '../../Core/Globals.js';
import { makeHTMLElement } from '../../Core/GridUtils.js';


/* *
 *
 *  Class
 *
 * */

/**
 * Renders computed summary rows in a dedicated frozen tbody section below the
 * scrollable table body.
 */
class SummaryView {

    /* *
     *
     *  Properties
     *
     * */

    private readonly viewport: Table;

    /**
     * Frozen tbody element owned by the summary section.
     */
    public readonly tbodyElement: HTMLElement;

    /**
     * Currently rendered summary rows.
     */
    private rows: SummaryTableRow[] = [];


    /* *
     *
     *  Constructor
     *
     * */

    constructor(viewport: Table) {
        this.viewport = viewport;
        this.tbodyElement = makeHTMLElement('tbody', {
            className: Globals.classNamePrefix + 'tbody-summary'
        });

        viewport.registerBodySection({
            id: 'summary',
            position: 'after',
            tbodyElement: this.tbodyElement,
            getRows: (): TableRow[] => this.rows,
            getRowByElement: (element): (TableRow | undefined) =>
                this.rows.find(
                    (row): boolean => row.htmlElement === element
                ),
            getRowById: (): (TableRow | undefined) => void 0
        });
    }


    /* *
     *
     *  Methods
     *
     * */

    /**
     * Renders the given summary row objects, reusing existing rows.
     *
     * @param rowObjects
     * Computed summary row objects keyed by column id.
     */
    public async render(rowObjects: DataTableRowObject[]): Promise<void> {
        const tableElement = this.viewport.tableElement;

        if (
            rowObjects.length &&
            this.tbodyElement.parentElement !== tableElement
        ) {
            tableElement.appendChild(this.tbodyElement);
        }

        for (let i = 0, iEnd = rowObjects.length; i < iEnd; ++i) {
            let row = this.rows[i];

            if (!row) {
                row = new SummaryTableRow(this.viewport, i);
                await row.sync(rowObjects[i], i);
                await row.init();
                await row.render();
                this.tbodyElement.appendChild(row.htmlElement);
                this.rows[i] = row;
            } else {
                await row.sync(rowObjects[i], i);
                if (!row.htmlElement.isConnected) {
                    this.tbodyElement.appendChild(row.htmlElement);
                }
            }
        }

        for (let i = this.rows.length - 1; i >= rowObjects.length; --i) {
            this.rows[i].destroy();
            this.rows.length = i;
        }

        if (!this.rows.length && this.tbodyElement.parentElement) {
            this.tbodyElement.remove();
        }

        this.syncHorizontalScroll(this.viewport.tbodyElement.scrollLeft);
        await this.viewport.syncAriaRowIndexes();
    }

    /**
     * Re-applies per-cell widths and horizontal offset after a reflow.
     */
    public reflow(): void {
        for (let i = 0, iEnd = this.rows.length; i < iEnd; ++i) {
            this.rows[i].reflow();
        }

        this.syncHorizontalScroll(this.viewport.tbodyElement.scrollLeft);
    }

    /**
     * Keeps the frozen rows aligned with the main body horizontal scroll.
     *
     * @param scrollLeft
     * Current horizontal scroll offset of the main body.
     */
    public syncHorizontalScroll(scrollLeft: number): void {
        const transform = scrollLeft ? `translateX(${-scrollLeft}px)` : '';

        this.tbodyElement.scrollLeft = 0;
        for (let i = 0, iEnd = this.rows.length; i < iEnd; ++i) {
            this.rows[i].htmlElement.style.transform = transform;
        }
    }

    /**
     * Unregisters the section and removes all rendered rows.
     */
    public destroy(): void {
        this.viewport.unregisterBodySection('summary');

        for (let i = 0, iEnd = this.rows.length; i < iEnd; ++i) {
            this.rows[i].destroy();
        }

        this.rows.length = 0;
        this.tbodyElement.remove();
    }

}


/* *
 *
 *  Default Export
 *
 * */

export default SummaryView;

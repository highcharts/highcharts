/* *
 *
 *  Grid Pro pinned table row
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type Cell from '../../Core/Table/Cell';
import type Column from '../../Core/Table/Column';
import type { RowObject as DataTableRowObject } from '../../../Data/DataTable';
import type { RowId } from '../../Core/Data/DataProvider';

import TableRow from '../../Core/Table/Body/TableRow.js';
import PinnedTableCell from './PinnedTableCell.js';
import Globals from '../../Core/Globals.js';

class PinnedTableRow extends TableRow {

    public readonly bodySectionId: 'top'|'bottom';

    constructor(
        viewport: TableRow['viewport'],
        section: 'top'|'bottom',
        index: number
    ) {
        super(viewport, index);
        this.bodySectionId = section;
    }

    public override init(): Promise<void> {
        this.setRowAttributes();
        return Promise.resolve();
    }

    public override createCell(column: Column): Cell {
        return new PinnedTableCell(this, column);
    }

    public override async update(): Promise<void> {
        await this.sync(this.id, this.data, this.index);
    }

    public async sync(
        rowId: RowId | undefined,
        data: DataTableRowObject,
        index: number = this.index,
        doReflow: boolean = true
    ): Promise<void> {
        this.index = index;
        this.id = rowId;
        this.data = data;
        this.setRowAttributes();

        if (this.rendered) {
            for (let i = 0, iEnd = this.cells.length; i < iEnd; ++i) {
                await (this.cells[i] as PinnedTableCell).setValue();
            }
        }

        if (doReflow) {
            this.reflow();
        }
    }

    public override setHoveredState(hovered: boolean): void {
        this.htmlElement.classList[hovered ? 'add' : 'remove'](
            Globals.getClassName('hoveredRow')
        );
    }

    public override setSyncedState(synced: boolean): void {
        this.htmlElement.classList[synced ? 'add' : 'remove'](
            Globals.getClassName('syncedRow')
        );
    }

    public override setRowAttributes(): void {
        const el = this.htmlElement;

        el.classList.add(Globals.getClassName('rowElement'));
        el.removeAttribute('data-row-index');
        el.setAttribute('data-pinned-section', this.bodySectionId);

        this.updateRowAttributes();
        this.updateParityClass();
        this.updateStateClasses();
    }

    public override updateRowAttributes(): void {
        const el = this.htmlElement;

        if (this.id !== void 0) {
            el.setAttribute('data-row-id', this.id);
        }

        el.removeAttribute('aria-rowindex');
    }

    protected override updateParityClass(): void {
        const el = this.htmlElement;
        el.classList.remove(
            Globals.getClassName('rowEven'),
            Globals.getClassName('rowOdd')
        );

        el.classList.add(
            Globals.getClassName(this.index % 2 ? 'rowEven' : 'rowOdd')
        );
    }

    protected override updateStateClasses(): void {
        const el = this.htmlElement;
        el.classList.remove(
            Globals.getClassName('hoveredRow'),
            Globals.getClassName('syncedRow')
        );
    }
}

export default PinnedTableRow;

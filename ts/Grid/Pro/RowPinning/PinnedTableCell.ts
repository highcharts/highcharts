/* *
 *
 *  Grid Pro pinned table cell
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

import type { CellType as DataTableCellType } from '../../../Data/DataTable';
import type PinnedTableRow from './PinnedTableRow';

import TableCell from '../../Core/Table/Body/TableCell.js';
import { defined } from '../../../Shared/Utilities.js';

class PinnedTableCell extends TableCell {

    public declare readonly row: PinnedTableRow;

    public override async setValue(
        value?: DataTableCellType,
        updateDataset: boolean = false
    ): Promise<void> {
        if (!defined(value)) {
            const sourceColumnId = this.column.viewport.grid.columnPolicy
                .getColumnSourceId(this.column.id);

            value = (
                sourceColumnId && sourceColumnId in this.row.data ?
                    this.row.data[sourceColumnId] :
                    this.row.data[this.column.id]
            ) as DataTableCellType;
        }

        await super.setValue(value, updateDataset);
    }

    protected override async updateDataset(): Promise<boolean> {
        const sourceColumnId = this.column.viewport.grid.columnPolicy
            .getColumnSourceId(this.column.id);
        if (!sourceColumnId) {
            return false;
        }

        const oldValue = (
            sourceColumnId in this.row.data ?
                this.row.data[sourceColumnId] :
                this.row.data[this.column.id]
        ) as DataTableCellType;

        if (oldValue === this.value) {
            return false;
        }

        const vp = this.column.viewport as (
            typeof this.column.viewport & {
                rowPinningView?: {
                    syncRenderedMirrors(
                        rowId: string|number,
                        columnId: string,
                        value: DataTableCellType,
                        sourceRow: PinnedTableRow,
                        sourceColumnId?: string
                    ): Promise<void>;
                };
            }
        );
        const { dataProvider: dp } = vp.grid;
        const rowId = this.row.id;
        if (!dp || rowId === void 0) {
            return false;
        }

        this.row.data[this.column.id] = this.value;
        if (sourceColumnId !== this.column.id) {
            this.row.data[sourceColumnId] = this.value;
        }

        await dp.setValue(
            this.value,
            sourceColumnId,
            rowId
        );

        vp.grid.rowPinning?.updatePinnedRowValue(
            rowId,
            this.column.id,
            this.value
        );

        if (vp.grid.querying.willNotModify()) {
            await vp.rowPinningView?.syncRenderedMirrors(
                rowId,
                this.column.id,
                this.value,
                this.row,
                sourceColumnId
            );
            return false;
        }

        await vp.updateRows();
        return true;
    }

    protected override onFocus(): void {
        super.onFocus();

        const rowId = this.row.id;
        if (rowId === void 0) {
            return;
        }

        this.row.viewport.focusCursor = {
            bodySectionId: this.row.bodySectionId,
            rowId,
            columnIndex: this.column.index
        };
    }

    public override onMouseOver(): void {
        this.row.setHoveredState(true);
        super.onMouseOver();
    }

    public override onMouseOut(): void {
        this.row.setHoveredState(false);
        super.onMouseOut();
    }
}

export default PinnedTableCell;

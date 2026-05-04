/* *
 *
 *  Grid Row Pinning viewport helper
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 *  Author:
 *  - Mikkel Espolin Birkeland
 *  - Dawid Dragula
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type { CellType as DataTableCellType } from '../../../Data/DataTable';
import type { RowId } from '../../Core/Data/DataProvider';

import Table from '../../Core/Table/Table.js';
import TableCell from '../../Core/Table/Body/TableCell.js';
import TableRow from '../../Core/Table/Body/TableRow.js';
import GridUtils from '../../Core/GridUtils.js';
import Globals from '../../Core/Globals.js';
import { getGridRowPinningOptions } from './RowPinningController.js';
import PinnedTableRow from './PinnedTableRow.js';

const { makeHTMLElement } = GridUtils;

/**
 * The class names used by the row pinning functionality.
 */
export const classNames = {
    pinnedTbodyElement: Globals.classNamePrefix + 'tbody-pinned',
    pinnedTopTbodyElement: Globals.classNamePrefix + 'tbody-pinned-top',
    pinnedBottomTbodyElement: Globals.classNamePrefix + 'tbody-pinned-bottom',
    rowPinned: Globals.classNamePrefix + 'row-pinned',
    rowPinnedTop: Globals.classNamePrefix + 'row-pinned-top',
    rowPinnedBottom: Globals.classNamePrefix + 'row-pinned-bottom'
} as const;

interface PinnedSectionDescriptor {
    position: 'top'|'bottom';
    rowIds: RowId[];
    rows: PinnedTableRow[];
    tbody: HTMLElement;
    rowById: Map<RowId, PinnedTableRow>;
}

export interface PinningViewportCompensationState {
    anchorRowId?: RowId;
    anchorRowTop?: number;
    pinnedTopHeight: number;
}

class RowPinningView {

    public readonly viewport: Table;

    public readonly pinnedTopTbodyElement: HTMLElement;

    public readonly pinnedBottomTbodyElement: HTMLElement;

    private readonly pinnedTopRows: PinnedTableRow[] = [];

    private readonly pinnedBottomRows: PinnedTableRow[] = [];

    private readonly pinnedTopRowById: Map<RowId, PinnedTableRow> = new Map();

    private readonly pinnedBottomRowById: Map<RowId, PinnedTableRow> =
        new Map();

    private scrollbarCompensationQueued = false;

    constructor(viewport: Table) {
        this.viewport = viewport;

        this.pinnedTopTbodyElement = makeHTMLElement(
            'tbody',
            {
                className: [
                    classNames.pinnedTbodyElement,
                    classNames.pinnedTopTbodyElement
                ].join(' ')
            }
        );
        this.pinnedTopTbodyElement.setAttribute(
            'aria-label',
            'Pinned top rows'
        );

        this.pinnedBottomTbodyElement = makeHTMLElement(
            'tbody',
            {
                className: [
                    classNames.pinnedTbodyElement,
                    classNames.pinnedBottomTbodyElement
                ].join(' ')
            }
        );
        this.pinnedBottomTbodyElement.setAttribute(
            'aria-label',
            'Pinned bottom rows'
        );

        viewport.registerBodySection({
            id: 'top',
            position: 'before',
            tbodyElement: this.pinnedTopTbodyElement,
            getRows: (): TableRow[] => this.pinnedTopRows,
            getRowByElement: (rowElement: HTMLElement): (
                TableRow | undefined
            ) => this.pinnedTopRows.find((row): boolean =>
                row.htmlElement === rowElement
            ),
            getRowById: (rowId: RowId): (TableRow | undefined) =>
                this.pinnedTopRowById.get(rowId)
        });
        viewport.registerBodySection({
            id: 'bottom',
            position: 'after',
            tbodyElement: this.pinnedBottomTbodyElement,
            getRows: (): TableRow[] => this.pinnedBottomRows,
            getRowByElement: (rowElement: HTMLElement): (
                TableRow | undefined
            ) => this.pinnedBottomRows.find((row): boolean =>
                row.htmlElement === rowElement
            ),
            getRowById: (rowId: RowId): (TableRow | undefined) =>
                this.pinnedBottomRowById.get(rowId)
        });
    }

    public getRows(section: 'top'|'bottom'): TableRow[] {
        return section === 'top' ? this.pinnedTopRows : this.pinnedBottomRows;
    }

    public getPinnedRowsCount(): number {
        return this.pinnedTopRows.length + this.pinnedBottomRows.length;
    }

    public getRenderedPinnedRowById(
        rowId: RowId,
        section: 'top'|'bottom'
    ): TableRow | undefined {
        return section === 'top' ?
            this.pinnedTopRowById.get(rowId) :
            this.pinnedBottomRowById.get(rowId);
    }

    public getBodyForSection(section: 'top'|'bottom'): HTMLElement {
        return section === 'top' ?
            this.pinnedTopTbodyElement :
            this.pinnedBottomTbodyElement;
    }

    public getSectionForBody(
        tbody: HTMLElement
    ): ('top'|'bottom'|undefined) {
        if (tbody === this.pinnedTopTbodyElement) {
            return 'top';
        }

        if (tbody === this.pinnedBottomTbodyElement) {
            return 'bottom';
        }
    }

    public getPinnedBodyMaxHeightSignature(): string {
        return [
            this.normalizeMaxHeight(this.getPinnedBodyMaxHeight('top')),
            this.normalizeMaxHeight(this.getPinnedBodyMaxHeight('bottom'))
        ].join('|');
    }

    public async refreshFromQueryCycle(
        deferLayout: boolean = false
    ): Promise<void> {
        await this.viewport.grid.rowPinning
            ?.recomputeResolvedFromMaterializedRows();
        const renderResult = await this.render(deferLayout);

        await this.viewport.grid.rowPinning?.handlePinnedRenderResult(
            renderResult,
            'query'
        );
    }

    public async render(
        deferLayout: boolean = false
    ): Promise<{ missingPinnedRowIds: RowId[] }> {
        const { viewport } = this;
        const cellEditing = (viewport as (Table & {
            cellEditing?: {
                editedCell?: unknown;
                stopEditing(submit?: boolean): void;
            };
        })).cellEditing;

        // Cancel any active cell editing before destroying/moving rows to
        // prevent orphaned inputs and stale cell references.
        if (cellEditing?.editedCell) {
            cellEditing.stopEditing(false);
        }

        const pinnedRows = viewport.grid.rowPinning?.getPinnedRows() || {
            topIds: [],
            bottomIds: []
        };
        const hasPinning = pinnedRows.topIds.length > 0 ||
            pinnedRows.bottomIds.length > 0;
        const pinnedSections = this.getPinnedSections(pinnedRows);

        this.ensurePinnedBodiesRendered(pinnedSections);

        if (!hasPinning) {
            this.clearPinnedRows();
            viewport.tbodyElement.style.display = '';

            if (!deferLayout) {
                this.applyPinnedBodyMaxHeights();
            }

            this.updateScrollableRowAttributes();
            await viewport.syncAriaRowIndexes();

            return { missingPinnedRowIds: [] };
        }

        const missingPinnedRowIds: RowId[] = [];
        for (const section of pinnedSections) {
            missingPinnedRowIds.push(...await this.syncPinnedRowsByIds(
                section.rows,
                section.tbody,
                section.rowIds,
                section.position
            ));
        }

        this.rebuildPinnedRowLookupMaps();
        this.updateScrollableRowAttributes();
        await viewport.syncAriaRowIndexes();

        viewport.tbodyElement.style.display = '';

        if (!deferLayout) {
            this.applyPinnedBodyMaxHeights();
            this.syncHorizontalScroll(viewport.tbodyElement.scrollLeft);
            this.applyPinnedScrollbarCompensation();
        }

        return { missingPinnedRowIds };
    }

    public reflow(): void {
        for (const row of this.pinnedTopRows.concat(this.pinnedBottomRows)) {
            row.reflow();
        }

        this.applyPinnedBodyMaxHeights();
        this.applyPinnedScrollbarCompensation();
        this.syncHorizontalScroll(this.viewport.tbodyElement.scrollLeft);
    }

    public destroy(): void {
        this.viewport.unregisterBodySection('top');
        this.viewport.unregisterBodySection('bottom');

        for (let i = 0, iEnd = this.pinnedTopRows.length; i < iEnd; ++i) {
            this.pinnedTopRows[i].destroy();
        }
        for (let i = 0, iEnd = this.pinnedBottomRows.length; i < iEnd; ++i) {
            this.pinnedBottomRows[i].destroy();
        }

        this.pinnedTopRows.length = 0;
        this.pinnedBottomRows.length = 0;
        this.pinnedTopRowById.clear();
        this.pinnedBottomRowById.clear();

        this.pinnedTopTbodyElement.remove();
        this.pinnedBottomTbodyElement.remove();
    }

    public revealRowInSection(
        rowId: RowId,
        section: 'top'|'bottom'
    ): void {
        const tbody = this.getBodyForSection(section);
        const row = this.getRenderedPinnedRowById(rowId, section);
        const rowElement = row?.htmlElement;

        if (!rowElement || !tbody.isConnected || tbody.clientHeight <= 0) {
            return;
        }

        const viewportTop = tbody.scrollTop;
        const viewportBottom = viewportTop + tbody.clientHeight;
        const rowTop = rowElement.offsetTop;
        const rowBottom = rowTop + rowElement.offsetHeight;

        if (rowTop < viewportTop) {
            tbody.scrollTop = Math.max(0, rowTop);
            return;
        }

        if (rowBottom > viewportBottom) {
            tbody.scrollTop = Math.max(0, rowBottom - tbody.clientHeight);
        }
    }

    public captureViewportCompensation(
        rowId: RowId
    ): PinningViewportCompensationState {
        const compensationState: PinningViewportCompensationState = {
            pinnedTopHeight: this.pinnedTopTbodyElement.isConnected ?
                this.pinnedTopTbodyElement.offsetHeight :
                0
        };
        const anchorRow = this.viewport.rows.find((row): boolean =>
            row.id === rowId
        );

        if (!anchorRow?.htmlElement.isConnected) {
            return compensationState;
        }

        const tbodyRect = this.viewport.tbodyElement.getBoundingClientRect();
        const rowRect = anchorRow.htmlElement.getBoundingClientRect();

        if (
            rowRect.bottom <= tbodyRect.top ||
            rowRect.top >= tbodyRect.bottom
        ) {
            return compensationState;
        }

        compensationState.anchorRowId = rowId;
        compensationState.anchorRowTop = rowRect.top;

        return compensationState;
    }

    public restoreViewportCompensation(
        compensationState: PinningViewportCompensationState
    ): void {
        let delta: number | undefined;

        if (
            compensationState.anchorRowId !== void 0 &&
            compensationState.anchorRowTop !== void 0
        ) {
            const anchorRow = this.viewport.rows.find((row): boolean =>
                row.id === compensationState.anchorRowId
            );
            const anchorElement = anchorRow?.htmlElement;

            if (anchorElement?.isConnected) {
                delta = (
                    anchorElement.getBoundingClientRect().top -
                    compensationState.anchorRowTop
                );
            }
        }

        if (delta === void 0) {
            delta = (
                (this.pinnedTopTbodyElement.isConnected ?
                    this.pinnedTopTbodyElement.offsetHeight :
                    0) -
                compensationState.pinnedTopHeight
            );
        }

        if (!delta) {
            return;
        }

        this.viewport.tbodyElement.scrollTop = Math.max(
            0,
            this.viewport.tbodyElement.scrollTop + delta
        );
    }

    public syncHorizontalScroll(scrollLeft: number): void {
        const hasPinnedBody = this.getPinnedSections()
            .some((section): boolean => section.tbody.isConnected);

        if (!hasPinnedBody) {
            return;
        }

        const offset = -scrollLeft;
        const transform = offset ? `translateX(${offset}px)` : '';

        for (const section of this.getPinnedSections()) {
            if (!section.tbody.isConnected) {
                continue;
            }

            // Keep pinned rows aligned via transform only. Updating both the
            // tbody scroll position and the row transform shifts content twice.
            section.tbody.scrollLeft = 0;

            for (let i = 0, iEnd = section.rows.length; i < iEnd; ++i) {
                section.rows[i].htmlElement.style.transform = transform;
            }
        }
    }

    public updateRowAttributes(row: TableRow): void {
        const vp = this.viewport;
        const el = row.htmlElement;
        const rowPinningDescriptions = vp.grid.options?.lang?.accessibility
            ?.rowPinning?.descriptions;

        el.classList.remove(
            classNames.rowPinned,
            classNames.rowPinnedTop,
            classNames.rowPinnedBottom
        );

        if (
            row instanceof PinnedTableRow &&
            row.bodySectionId === 'top'
        ) {
            el.classList.add(classNames.rowPinned);
            el.setAttribute(
                'aria-roledescription',
                rowPinningDescriptions?.pinnedTop ||
                'Pinned row in top section.'
            );
            return;
        }

        if (
            row instanceof PinnedTableRow &&
            row.bodySectionId === 'bottom'
        ) {
            el.classList.add(classNames.rowPinned);
            el.setAttribute(
                'aria-roledescription',
                rowPinningDescriptions?.pinnedBottom ||
                'Pinned row in bottom section.'
            );
            return;
        }

        if (row.id === void 0) {
            el.removeAttribute('aria-roledescription');
            return;
        }

        const pinnedRows = vp.grid.rowPinning?.getPinnedRows();
        if (pinnedRows?.topIds.includes(row.id)) {
            el.classList.add(classNames.rowPinned);
            el.classList.add(classNames.rowPinnedTop);
            el.setAttribute(
                'aria-roledescription',
                rowPinningDescriptions?.alsoPinnedTop ||
                'This row is also pinned to top section.'
            );
            return;
        }

        if (pinnedRows?.bottomIds.includes(row.id)) {
            el.classList.add(classNames.rowPinned);
            el.classList.add(classNames.rowPinnedBottom);
            el.setAttribute(
                'aria-roledescription',
                rowPinningDescriptions?.alsoPinnedBottom ||
                'This row is also pinned to bottom section.'
            );
            return;
        }

        el.removeAttribute('aria-roledescription');
    }

    public async syncRenderedMirrors(
        rowId: RowId,
        columnId: string,
        value: DataTableCellType,
        sourceRow: TableRow,
        sourceColumnId?: string
    ): Promise<void> {
        const renderedRows = new Set<TableRow>();
        const dataProvider = this.viewport.grid.dataProvider;
        const mainRowIndex = await dataProvider?.getRowIndex(rowId);

        const topRow = this.getRenderedPinnedRowById(rowId, 'top');
        if (topRow) {
            renderedRows.add(topRow);
        }

        const bottomRow = this.getRenderedPinnedRowById(rowId, 'bottom');
        if (bottomRow) {
            renderedRows.add(bottomRow);
        }

        if (typeof mainRowIndex === 'number') {
            const scrollRow = this.viewport.getRenderedRowByIndex(mainRowIndex);
            if (scrollRow) {
                renderedRows.add(scrollRow);
            }
        }

        for (const row of renderedRows) {
            if (row === sourceRow) {
                continue;
            }

            row.data[columnId] = value;
            if (sourceColumnId && sourceColumnId !== columnId) {
                row.data[sourceColumnId] = value;
            }

            const cell = row.cells.find((tableCell): boolean =>
                tableCell instanceof TableCell &&
                tableCell.column.id === columnId
            ) as (TableCell | undefined);

            if (cell) {
                await cell.setValue(value);
            }
        }
    }

    public async syncPinnedRowsFromMaterializedRows(): Promise<void> {
        const { grid } = this.viewport;

        if (!grid.rowPinning?.isEnabled()) {
            return;
        }

        const pinnedRows = grid.rowPinning.getPinnedRows();
        const pinnedIds = [
            ...pinnedRows.topIds,
            ...pinnedRows.bottomIds
        ];
        const hasPendingRenderedRows = this.hasPendingRenderedPinnedRows(
            pinnedRows
        );

        if (!pinnedIds.length) {
            return;
        }

        const {
            hydratedRowIds,
            definitiveMissingRowIds
        } = await grid.rowPinning.ensurePinnedRowsAvailable(pinnedIds);

        if (definitiveMissingRowIds.length) {
            grid.rowPinning.pruneMissingExplicitIds(definitiveMissingRowIds);
        }

        if (
            hasPendingRenderedRows ||
            hydratedRowIds.length ||
            definitiveMissingRowIds.length
        ) {
            await this.render(true);
        }
    }

    public async getScrollableRowCount(
        providerRowCount: number
    ): Promise<number> {
        const { grid } = this.viewport;

        if (!grid.querying.pagination.enabled) {
            return providerRowCount;
        }

        const pinnedRows = grid.rowPinning?.getPinnedRows();
        const pinnedSet = new Set([
            ...(pinnedRows?.topIds || []),
            ...(pinnedRows?.bottomIds || [])
        ]);
        let pinnedCount = 0;
        const dataProvider = grid.dataProvider;

        for (let i = 0; i < providerRowCount; ++i) {
            const rowId = await dataProvider?.getRowId(i);

            if (rowId !== void 0 && pinnedSet.has(rowId)) {
                ++pinnedCount;
            }
        }

        return Math.max(providerRowCount - pinnedCount, 0);
    }

    private getPinnedBodyMaxHeight(
        position: 'top'|'bottom'
    ): number|string|undefined {
        const pinningOptions = getGridRowPinningOptions(this.viewport.grid);

        return position === 'top' ?
            pinningOptions?.top?.maxHeight :
            pinningOptions?.bottom?.maxHeight;
    }

    private normalizeMaxHeight(
        value?: number|string
    ): string {
        if (typeof value === 'number' && value >= 0) {
            return value + 'px';
        }
        if (typeof value !== 'string') {
            return '';
        }

        const trimmed = value.trim();
        const percentMatch = trimmed.match(/^(\d+(\.\d+)?)%$/);

        if (percentMatch) {
            const percent = parseFloat(percentMatch[1]);
            const tableHeight = this.viewport.tableElement.clientHeight ||
                this.viewport.tbodyElement.clientHeight;
            const pxHeight = Math.max(
                0,
                Math.round(tableHeight * percent / 100)
            );

            return pxHeight + 'px';
        }

        if (/^\d+(\.\d+)?px$/.test(trimmed)) {
            return trimmed;
        }

        return '';
    }

    private applyPinnedBodyMaxHeights(): void {
        const apply = (tbody: HTMLElement, value?: number|string): void => {
            const maxHeight = this.normalizeMaxHeight(value);

            tbody.style.maxHeight = maxHeight;
            tbody.style.overflowY = maxHeight ? 'auto' : '';
            tbody.style.overflowX = maxHeight ? 'hidden' : '';
        };

        for (const section of this.getPinnedSections()) {
            apply(section.tbody, this.getPinnedBodyMaxHeight(section.position));
        }
    }

    private async syncPinnedRowsByIds(
        targetRows: PinnedTableRow[],
        tbody: HTMLElement,
        rowIds: RowId[],
        section: 'top'|'bottom'
    ): Promise<RowId[]> {
        const missingPinnedRowIds: RowId[] = [];
        const nextRows: PinnedTableRow[] = [];

        for (let i = 0; i < rowIds.length; ++i) {
            const rowId = rowIds[i];
            const rowData = this.viewport.grid.rowPinning?.getPinnedRowObject(
                rowId
            );

            if (!rowData) {
                missingPinnedRowIds.push(rowId);
                continue;
            }

            const nextIndex = nextRows.length;
            let row = targetRows[nextIndex];

            if (!row) {
                row = new PinnedTableRow(this.viewport, section, nextIndex);
                await row.sync(rowId, rowData, nextIndex, false);
                await row.init();
                await row.render();
                tbody.appendChild(row.htmlElement);
            } else {
                await row.sync(rowId, rowData, nextIndex, false);
                if (!row.htmlElement.isConnected) {
                    tbody.appendChild(row.htmlElement);
                }
            }

            this.updateRowAttributes(row);
            row.reflow();
            nextRows.push(row);
        }

        for (let i = nextRows.length; i < targetRows.length; ++i) {
            targetRows[i].destroy();
        }

        targetRows.length = 0;
        for (const row of nextRows) {
            targetRows.push(row);
        }

        return missingPinnedRowIds;
    }

    private rebuildPinnedRowLookupMaps(): void {
        for (const section of this.getPinnedSections()) {
            section.rowById.clear();

            for (const row of section.rows) {
                if (row.id !== void 0) {
                    section.rowById.set(row.id, row);
                }
            }
        }
    }

    private updateScrollableRowAttributes(): void {
        for (let i = 0, iEnd = this.viewport.rows.length; i < iEnd; ++i) {
            this.updateRowAttributes(this.viewport.rows[i]);
        }
    }

    /**
     * Keeps pinned sections aligned with the scrollable tbody content width by
     * compensating for the vertical scrollbar gutter.
     */
    private applyPinnedScrollbarCompensation(): void {
        const scrollableBody = this.viewport.tbodyElement;
        const mainGutterWidth = Math.max(
            0,
            scrollableBody.offsetWidth - scrollableBody.clientWidth
        );

        const applyToPinnedBody = (pinnedBody: HTMLElement): void => {
            if (!pinnedBody.isConnected) {
                pinnedBody.style.width = '';
                return;
            }

            const pinnedGutterWidth = Math.max(
                0,
                pinnedBody.offsetWidth - pinnedBody.clientWidth
            );
            const compensation = Math.max(
                0,
                mainGutterWidth - pinnedGutterWidth
            );

            pinnedBody.style.width = compensation > 0 ?
                `calc(100% - ${compensation}px)` :
                '';
        };

        for (const section of this.getPinnedSections()) {
            applyToPinnedBody(section.tbody);
        }

        if (!this.scrollbarCompensationQueued) {
            this.scrollbarCompensationQueued = true;
            requestAnimationFrame((): void => {
                this.scrollbarCompensationQueued = false;

                for (const section of this.getPinnedSections()) {
                    applyToPinnedBody(section.tbody);
                }
            });
        }
    }

    private ensurePinnedBodiesRendered(
        pinnedSections: PinnedSectionDescriptor[]
    ): void {
        const tableElement = this.viewport.tableElement;

        for (const section of pinnedSections) {
            if (!section.rowIds.length) {
                if (section.tbody.parentElement === tableElement) {
                    section.tbody.remove();
                }
                continue;
            }

            if (section.tbody.parentElement !== tableElement) {
                if (section.position === 'top') {
                    tableElement.insertBefore(
                        section.tbody,
                        this.viewport.tbodyElement
                    );
                } else {
                    tableElement.appendChild(section.tbody);
                }
            }
        }
    }

    private hasPendingRenderedPinnedRows(
        pinnedRows: { topIds: RowId[]; bottomIds: RowId[] }
    ): boolean {
        const { rowPinning } = this.viewport.grid;

        if (!rowPinning) {
            return false;
        }

        for (const section of this.getPinnedSections(pinnedRows)) {
            for (const rowId of section.rowIds) {
                if (
                    rowPinning.getPinnedRowObject(rowId) &&
                    !section.rowById.has(rowId)
                ) {
                    return true;
                }
            }
        }

        return false;
    }

    private clearPinnedRows(): void {
        for (const section of this.getPinnedSections()) {
            section.rows.forEach((row): void => row.destroy());
            section.rows.length = 0;
            section.rowById.clear();
        }
    }

    private getPinnedSections(
        pinnedRows: { topIds: RowId[]; bottomIds: RowId[] } = {
            topIds: [],
            bottomIds: []
        }
    ): PinnedSectionDescriptor[] {
        return [{
            position: 'top',
            rowIds: pinnedRows.topIds,
            rows: this.pinnedTopRows,
            tbody: this.pinnedTopTbodyElement,
            rowById: this.pinnedTopRowById
        }, {
            position: 'bottom',
            rowIds: pinnedRows.bottomIds,
            rows: this.pinnedBottomRows,
            tbody: this.pinnedBottomTbodyElement,
            rowById: this.pinnedBottomRowById
        }];
    }
}

export default RowPinningView;

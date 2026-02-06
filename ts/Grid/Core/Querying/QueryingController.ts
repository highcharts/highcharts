/* *
 *
 *  Grid Querying Controller class
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

import type DataTable from '../../../Data/DataTable.js';
import type { CellType as DataTableCellType } from '../../../Data/DataTable.js';
import type { RowObject as DataTableRowObject } from '../../../Data/DataTable.js';
import type DataModifier from '../../../Data/Modifiers/DataModifier.js';
import type Grid from '../Grid.js';
import type RowPinningController from '../../Pro/RowPinning/RowPinningController.js';

import ChainModifier from '../../../Data/Modifiers/ChainModifier.js';
import SortingController from './SortingController.js';
import FilteringController from './FilteringController.js';
import PaginationController from './PaginationController.js';
import DataTableClass from '../../../Data/DataTable.js';

/* *
 *
 *  Class
 *
 * */

/**
 * Class that manage data modification of the visible data in the data grid.
 * It manages the modifiers that are applied to the data table.
 */
class QueryingController {

    /* *
    *
    *  Properties
    *
    * */

    /**
     * The data grid instance.
     */
    public grid: Grid;

    /**
     * Sorting controller instance.
     */
    public sorting: SortingController;

    /**
     * Filtering controller instance.
     */
    public filtering: FilteringController;

    /**
     * Pagination controller instance
     */
    public pagination: PaginationController;

    /**
     * This flag should be set to `true` if the modifiers should reapply to the
     * data table due to some data change or other important reason.
     */
    public shouldBeUpdated: boolean = false;


    /* *
    *
    *  Constructor
    *
    * */

    constructor(grid: Grid) {
        this.grid = grid;

        this.filtering = new FilteringController(this);
        this.sorting = new SortingController(this);
        this.pagination = new PaginationController(this);
    }


    /* *
    *
    *  Functions
    *
    * */

    /**
     * Proceeds with the data modification if needed.
     *
     * @param force
     * If the data should be modified even if the significant options are not
     * changed.
     */
    public async proceed(force: boolean = false): Promise<void> {
        if (force || this.shouldBeUpdated) {
            await this.modifyData();
        }
    }

    /**
     * Load all options needed to generate the modifiers.
     */
    public loadOptions(): void {
        this.filtering.loadOptions();
        this.sorting.loadOptions();
        this.pagination.loadOptions();
    }

    /**
     * Creates a list of modifiers that should be applied to the data table.
     */
    public willNotModify(): boolean {
        return (
            !this.sorting.modifier &&
            !this.filtering.modifier
        );
    }

    /**
     * Returns a list of modifiers that should be applied to the data table.
     */
    public getGroupedModifiers(): DataModifier[] {
        const modifiers: DataModifier[] = [];

        if (this.sorting.modifier) {
            modifiers.push(this.sorting.modifier);
        }

        if (this.filtering.modifier) {
            modifiers.push(this.filtering.modifier);
        }

        return modifiers;
    }

    /**
     * Apply all modifiers to the data table.
     */
    private async modifyData(): Promise<void> {
        const originalDataTable = this.grid.dataTable;
        if (!originalDataTable) {
            return;
        }

        const rowPinning = (this.grid as {
            rowPinning?: RowPinningController;
        }).rowPinning;

        if (rowPinning?.isEnabled()) {
            await this.modifyDataWithRowPinning(originalDataTable, rowPinning);
            return;
        }

        const groupedModifiers = this.getGroupedModifiers();
        let interTable: DataTable;

        // Grouped modifiers
        if (groupedModifiers.length > 0) {
            const chainModifier = new ChainModifier({}, ...groupedModifiers);
            const dataTableCopy = originalDataTable.clone();
            await chainModifier.modify(dataTableCopy.getModified());
            interTable = dataTableCopy.getModified();
        } else {
            interTable = originalDataTable.getModified();
        }

        // Pagination modifier
        const paginationModifier =
            this.pagination.createModifier(interTable.rowCount);
        if (paginationModifier) {
            interTable = interTable.clone();
            await paginationModifier.modify(interTable);
            interTable = interTable.getModified();
        }

        this.grid.presentationTable = interTable;
        delete this.grid.rowPinningMeta;
        this.shouldBeUpdated = false;
    }

    private async modifyDataWithRowPinning(
        originalDataTable: DataTable,
        rowPinning: RowPinningController
    ): Promise<void> {
        const groupedTable = await this.applyGroupedModifiers(
            originalDataTable
        );
        const groupedOriginalIndexes = QueryingController.getOriginalIndexes(
            groupedTable
        );

        const sortingActive = !!this.sorting.modifier;
        const filteringActive = !!this.filtering.modifier;

        let sortingOriginalIndexes: (number[]|undefined);
        if (
            sortingActive &&
            filteringActive &&
            rowPinning.isSortingIncluded() &&
            !rowPinning.isFilteringIncluded()
        ) {
            sortingOriginalIndexes = QueryingController.getOriginalIndexes(
                await this.applySortingOnlyModifier(originalDataTable)
            );
        }

        const pinned = rowPinning.computePinnedState(originalDataTable, {
            groupedOriginalIndexes,
            sortingOriginalIndexes,
            sortingActive,
            filteringActive
        });

        const pinnedOriginalIndexSet = new Set<number>([
            ...pinned.topOriginalIndexes,
            ...pinned.bottomOriginalIndexes
        ]);
        const nonPinnedOriginalIndexes = groupedOriginalIndexes.filter((
            idx
        ): boolean => !pinnedOriginalIndexSet.has(idx));

        let paginatedNonPinnedOriginalIndexes = nonPinnedOriginalIndexes;
        const paginationModifier = this.pagination.createModifier(
            nonPinnedOriginalIndexes.length
        );
        if (paginationModifier) {
            const nonPinnedTable =
                QueryingController.createTableFromOriginalIndexes(
                    originalDataTable,
                    nonPinnedOriginalIndexes
                );
            await paginationModifier.modify(nonPinnedTable);

            paginatedNonPinnedOriginalIndexes =
                QueryingController.getOriginalIndexes(
                    nonPinnedTable.getModified()
                );
        }

        const finalOriginalIndexes = [
            ...pinned.topOriginalIndexes,
            ...paginatedNonPinnedOriginalIndexes,
            ...pinned.bottomOriginalIndexes
        ];

        this.grid.presentationTable =
            QueryingController.createTableFromOriginalIndexes(
                originalDataTable,
                finalOriginalIndexes
            );
        this.grid.rowPinningMeta = {
            topCount: pinned.topOriginalIndexes.length,
            bottomCount: pinned.bottomOriginalIndexes.length,
            scrollableCount: paginatedNonPinnedOriginalIndexes.length,
            topRowIds: pinned.topRowIds.slice(),
            bottomRowIds: pinned.bottomRowIds.slice()
        };
        this.shouldBeUpdated = false;
    }

    private async applyGroupedModifiers(
        originalDataTable: DataTable
    ): Promise<DataTable> {
        const groupedModifiers = this.getGroupedModifiers();

        if (!groupedModifiers.length) {
            return originalDataTable.getModified();
        }

        const chainModifier = new ChainModifier({}, ...groupedModifiers);
        const dataTableCopy = originalDataTable.clone();
        await chainModifier.modify(dataTableCopy.getModified());
        return dataTableCopy.getModified();
    }

    private async applySortingOnlyModifier(
        originalDataTable: DataTable
    ): Promise<DataTable> {
        const sortingModifier = this.sorting.modifier;
        if (!sortingModifier) {
            return originalDataTable.getModified();
        }

        const tableCopy = originalDataTable.clone();
        await sortingModifier.modify(tableCopy.getModified());
        return tableCopy.getModified();
    }

    private static createTableFromOriginalIndexes(
        originalDataTable: DataTable,
        originalIndexes: number[]
    ): DataTable {
        const columnIds = originalDataTable.getColumnIds();
        const columns: Record<string, DataTableCellType[]> = {};

        for (const columnId of columnIds) {
            columns[columnId] = [];
        }

        const table = new DataTableClass({
            columns
        });
        const rows = originalIndexes.map((index): DataTableRowObject => (
            originalDataTable.getRowObject(index, columnIds) || {}
        ));

        table.setRows(rows);
        table.setOriginalRowIndexes(originalIndexes);

        return table.getModified();
    }

    private static getOriginalIndexes(table: DataTable): number[] {
        const result: number[] = [];
        for (let i = 0, iEnd = table.getRowCount(); i < iEnd; ++i) {
            const originalIndex = table.getOriginalRowIndex(i);
            if (typeof originalIndex === 'number') {
                result.push(originalIndex);
            }
        }
        return result;
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default QueryingController;

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

import type {
    FilterCondition,
    SerializableCondition
} from '../../../Data/Modifiers/FilterModifierOptions.js';
import type DataModifier from '../../../Data/Modifiers/DataModifier.js';
import type Grid from '../Grid.js';
import type { WorkerQueryingOptions } from '../Options.js';

import DataTable from '../../../Data/DataTable.js';
import ChainModifier from '../../../Data/Modifiers/ChainModifier.js';
import SortingController from './SortingController.js';
import FilteringController from './FilteringController.js';
import PaginationController from './PaginationController.js';
import IndexedDataTable from './IndexedDataTable.js';
import WorkerQuerying, { WorkerSortingState } from './WorkerQuerying.js';

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

    /**
     * Optional worker-based querying helper.
     */
    private workerQuerying?: WorkerQuerying;


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

        const filterCondition = this.filtering.getCondition();
        const sortings = (this.sorting.currentSortings || [])
            .filter((sorting): sorting is WorkerSortingState =>
                !!(sorting.columnId && sorting.order)
            )
            .map((sorting): WorkerSortingState => ({
                columnId: sorting.columnId,
                order: sorting.order
            }));

        const workerIndices = await this.tryWorkerQuerying(
            originalDataTable,
            sortings,
            filterCondition
        );

        if (workerIndices !== null) {
            let indices = workerIndices;
            const range = this.pagination.getRange(indices.length);
            if (range) {
                indices = indices.slice(range.start, range.end);
            }
            this.grid.presentationTable = this.buildIndexedView(
                originalDataTable,
                indices
            );
            this.shouldBeUpdated = false;
            return;
        }

        let interTable: DataTable;

        const groupedModifiers = this.getGroupedModifiers();

        // Grouped modifiers
        if (groupedModifiers.length > 0) {
            const chainModifier = new ChainModifier(
                {},
                ...groupedModifiers
            );
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
        this.shouldBeUpdated = false;
    }

    private getWorkerOptions(): WorkerQueryingOptions | undefined {
        return this.grid.options?.performance?.workerQuerying;
    }

    private hasCustomSortCompare(sortings: WorkerSortingState[]): boolean {
        const defaultCompare =
            this.grid.options?.columnDefaults?.sorting?.compare;
        if (defaultCompare) {
            return true;
        }

        for (const sorting of sortings) {
            const compare = this.grid.columnOptionsMap?.[sorting.columnId]
                ?.options?.sorting?.compare;
            if (compare) {
                return true;
            }
        }

        return false;
    }

    private collectFilterColumnIds(
        condition: FilterCondition | undefined,
        columns: Set<string>
    ): void {
        if (!condition || typeof condition === 'function') {
            return;
        }

        const serializable = condition as SerializableCondition;
        if ('columnId' in serializable) {
            columns.add(serializable.columnId);
        }

        if (
            'conditions' in serializable &&
            Array.isArray(serializable.conditions)
        ) {
            for (const nested of serializable.conditions) {
                this.collectFilterColumnIds(nested, columns);
            }
        }

        if ('condition' in serializable) {
            this.collectFilterColumnIds(serializable.condition, columns);
        }
    }

    private getWorkerColumnIds(
        sortings: WorkerSortingState[],
        filterCondition: FilterCondition | undefined
    ): string[] {
        const columns = new Set<string>();
        for (const sorting of sortings) {
            columns.add(sorting.columnId);
        }
        this.collectFilterColumnIds(filterCondition, columns);
        return Array.from(columns);
    }

    private getWorkerQuerying(): WorkerQuerying {
        if (!this.workerQuerying) {
            this.workerQuerying = new WorkerQuerying();
        }
        return this.workerQuerying;
    }

    private async tryWorkerQuerying(
        originalDataTable: DataTable,
        sortings: WorkerSortingState[],
        filterCondition: FilterCondition | undefined
    ): Promise<number[] | null> {
        const options = this.getWorkerOptions();
        const hasQuerying = !!(sortings.length || filterCondition);

        if (!WorkerQuerying.shouldUse(
            options,
            originalDataTable.getRowCount(),
            hasQuerying
        )) {
            return null;
        }

        if (this.hasCustomSortCompare(sortings)) {
            return null;
        }

        if (!WorkerQuerying.canHandleCondition(filterCondition)) {
            return null;
        }

        const columnIds = this.getWorkerColumnIds(sortings, filterCondition);
        const columns = originalDataTable.getColumns(columnIds, true);
        const rowCount = originalDataTable.getRowCount();
        const worker = this.getWorkerQuerying();

        const indices = await worker.computeIndices({
            columns,
            rowCount,
            sortings,
            filterCondition: (
                filterCondition as SerializableCondition | undefined
            )
        });

        if (!indices) {
            return null;
        }

        return indices;
    }

    private buildIndexedView(
        originalDataTable: DataTable,
        indices: number[]
    ): DataTable {
        return new IndexedDataTable(originalDataTable, indices);
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default QueryingController;

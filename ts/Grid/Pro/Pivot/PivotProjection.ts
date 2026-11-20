/* *
 *
 *  Grid Pivot Projection
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
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
    CellType as DataTableCellType,
    Column as DataTableColumn
} from '../../../Data/DataTable';
import type { GroupedHeaderOptions } from '../../Core/Options';
import type {
    PivotColumnMeta,
    PivotLangOptions,
    PivotValueOptions
} from './PivotOptions';

import Aggregation from '../Aggregation/Aggregation.js';
import DataTable from '../../../Data/DataTable.js';
import { createGridSortCompare } from '../../Core/Querying/SortingUtils.js';
import { defined } from '../../../Shared/Utilities.js';


/* *
 *
 *  Constants
 *
 * */

/**
 * Id of the generated column holding the row field values. The column is the
 * tree column of the pivot, so it renders the whole row hierarchy.
 */
export const PIVOT_ROWS_COLUMN_ID = 'pivotRows';

/**
 * Separator joining the row field values into the tree path. A control
 * character keeps field values containing a printable separator intact.
 */
export const PIVOT_PATH_SEPARATOR = '\u0000';

/**
 * Bucket key of a cell aggregating every column field value. Key parts of
 * real field values always start with `|`, so the marker cannot collide.
 */
const TOTAL_COLUMN_KEY = '*total';

/**
 * Separator between the row and the column key of a bucket.
 */
const BUCKET_KEY_SEPARATOR = '\u0001';

const compareAscending = createGridSortCompare('asc');


/* *
 *
 *  Declarations
 *
 * */

/**
 * Pivot options with every default resolved.
 */
export interface ResolvedPivotOptions {
    rows: string[];
    columns: string[];
    values: PivotValueOptions[];
    subtotals: boolean;
    grandTotalRow: ('top'|'bottom'|false);
    grandTotalColumn: ('start'|'end'|false);
}

/**
 * Result of projecting a source table into a pivot table.
 */
export interface PivotProjectionResult {
    /**
     * Projected table, holding one row per row field value combination.
     */
    table: DataTable;

    /**
     * Header tree nesting the generated columns under their column field
     * values.
     */
    header: Array<GroupedHeaderOptions|string>;

    /**
     * Generated column ids in rendering order.
     */
    generatedColumnIds: string[];

    /**
     * Description of every generated column, keyed by column id.
     */
    columnMetaById: Record<string, PivotColumnMeta>;

    /**
     * Grand total values keyed by generated column id, or `undefined` when the
     * grand total row is disabled.
     */
    grandTotalValues?: Record<string, DataTableCellType>;
}

/**
 * Node of the row field value tree.
 */
interface PivotRowNode {
    path: DataTableCellType[];
    childKeys: string[];
}

/**
 * Everything needed to resolve the cells of one generated column.
 */
interface PivotColumnBinding {
    columnKey: string;
    meta: PivotColumnMeta;
    value: PivotValueOptions;
}


/* *
 *
 *  Functions
 *
 * */

/**
 * Creates a key part that distinguishes field values of different types and
 * lengths, so that two different values never share a key.
 *
 * @param value
 * Field value.
 *
 * @return
 * Injective string representation of the value.
 */
function getKeyPart(value: DataTableCellType): string {
    const stringValue = String(value);

    return '|' + typeof value + ':' + stringValue.length + ':' + stringValue;
}

/**
 * Renders a field value as a path segment of the row hierarchy.
 *
 * @param value
 * Field value.
 *
 * @param lang
 * Pivot language options.
 *
 * @return
 * Path segment.
 */
function getPathSegment(
    value: DataTableCellType,
    lang: PivotLangOptions
): string {
    if (!defined(value) || value === '') {
        return lang.blank || '';
    }

    return String(value);
}

/**
 * Compares two field value paths level by level, ascending.
 *
 * @param a
 * First path.
 *
 * @param b
 * Second path.
 *
 * @return
 * Negative when `a` sorts first, positive when `b` does, `0` when equal.
 */
function comparePaths(
    a: DataTableCellType[],
    b: DataTableCellType[]
): number {
    for (let i = 0, iEnd = Math.min(a.length, b.length); i < iEnd; ++i) {
        const result = compareAscending(a[i], b[i]);

        if (result) {
            return result;
        }
    }

    return a.length - b.length;
}

/**
 * Throws when the pivot options refer to columns the source table does not
 * have, or to the same value column twice.
 *
 * @param columns
 * Source table columns.
 *
 * @param options
 * Resolved pivot options.
 */
function validateFields(
    columns: Record<string, DataTableColumn>,
    options: ResolvedPivotOptions
): void {
    const fields = options.rows.concat(options.columns);

    for (let i = 0, iEnd = fields.length; i < iEnd; ++i) {
        if (!columns[fields[i]]) {
            throw new Error(`Pivot: field column "${fields[i]}" not found.`);
        }
    }

    if (!options.values.length) {
        throw new Error('Pivot: `pivot.values` must not be empty.');
    }

    const usedValueColumns = new Set<string>();
    for (let i = 0, iEnd = options.values.length; i < iEnd; ++i) {
        const columnId = options.values[i].columnId;

        if (!columns[columnId]) {
            throw new Error(`Pivot: value column "${columnId}" not found.`);
        }

        if (usedValueColumns.has(columnId)) {
            throw new Error(
                `Pivot: value column "${columnId}" is used more than once.`
            );
        }

        usedValueColumns.add(columnId);
    }

    if (columns[PIVOT_ROWS_COLUMN_ID]) {
        throw new Error(
            `Pivot: source column "${PIVOT_ROWS_COLUMN_ID}" conflicts with ` +
            'the generated row field column.'
        );
    }
}

/**
 * Aggregates the source rows behind a single pivot cell.
 *
 * @param binding
 * Generated column the cell belongs to.
 *
 * @param sourceValues
 * Source column the values are taken from.
 *
 * @param rowIndexes
 * Source row indexes the cell covers.
 *
 * @param rowPath
 * Row field values of the cell.
 *
 * @param isSubtotal
 * Whether the cell belongs to a row that subtotals its child rows.
 *
 * @param isGrandTotal
 * Whether the cell belongs to the grand total row.
 *
 * @return
 * Aggregated cell value.
 */
function aggregateCell(
    binding: PivotColumnBinding,
    sourceValues: DataTableColumn,
    rowIndexes: number[],
    rowPath: DataTableCellType[],
    isSubtotal: boolean,
    isGrandTotal: boolean
): DataTableCellType {
    // A combination of field values no source row has is an empty cell, not a
    // zero, which is what a numeric aggregator returns for no values at all.
    if (!rowIndexes.length) {
        return null;
    }

    const functionName = Aggregation.resolveAggregatorName(
        binding.value.aggregator,
        {
            columnId: binding.value.columnId,
            rowPath,
            columnPath: binding.meta.columnPath,
            isSubtotal,
            isGrandTotal,
            rowCount: rowIndexes.length
        }
    );

    if (!functionName) {
        return null;
    }

    const cellValues: Array<Exclude<DataTableCellType, null|undefined>> = [];
    for (let i = 0, iEnd = rowIndexes.length; i < iEnd; ++i) {
        const cellValue = sourceValues[rowIndexes[i]] as DataTableCellType;

        if (defined(cellValue)) {
            cellValues.push(cellValue);
        }
    }

    return Aggregation.executeAggregate(functionName, cellValues);
}

/**
 * Builds the nested header tree of the generated columns.
 *
 * @param columnPaths
 * Ordered column field value paths.
 *
 * @param columnIdsByPathIndex
 * Generated column ids of each path, in value field order.
 *
 * @param lang
 * Pivot language options.
 *
 * @return
 * Header entries nesting the generated columns under their field values.
 */
function buildColumnHeaders(
    columnPaths: DataTableCellType[][],
    columnIdsByPathIndex: string[][],
    lang: PivotLangOptions
): GroupedHeaderOptions[] {
    if (!columnPaths.length) {
        return [];
    }

    const levels = columnPaths[0].length;

    /**
     * Groups the paths sharing a field value on the current level.
     *
     * @param pathIndexes
     * Indexes of the paths to group.
     *
     * @param level
     * Zero-based column field level.
     *
     * @return
     * Header entries of the level.
     */
    const build = (
        pathIndexes: number[],
        level: number
    ): GroupedHeaderOptions[] => {
        if (level === levels) {
            return columnIdsByPathIndex[pathIndexes[0]].map(
                (columnId): GroupedHeaderOptions => ({ columnId })
            );
        }

        const headers: GroupedHeaderOptions[] = [];
        let groupStart = 0;

        for (let i = 1, iEnd = pathIndexes.length; i <= iEnd; ++i) {
            const groupValue = columnPaths[pathIndexes[i - 1]][level];

            if (
                i < iEnd &&
                compareAscending(
                    groupValue,
                    columnPaths[pathIndexes[i]][level]
                ) === 0
            ) {
                continue;
            }

            headers.push({
                format: getPathSegment(groupValue, lang),
                columns: build(pathIndexes.slice(groupStart, i), level + 1)
            });
            groupStart = i;
        }

        return headers;
    };

    return build(columnPaths.map((_, index): number => index), 0);
}

/**
 * Projects a source table into a pivot table, where the values of the column
 * fields become generated columns and the values of the row fields become a
 * tree path rendered in a single generated column.
 *
 * Every cell, including subtotals and the grand total, aggregates the source
 * rows it covers rather than the cells below it, so that an `AVERAGE` subtotal
 * is the average of the source rows and not an average of averages.
 *
 * @param source
 * Queried source table, after filtering and sorting.
 *
 * @param options
 * Resolved pivot options.
 *
 * @param lang
 * Pivot language options.
 *
 * @return
 * Projected table with the header tree and the generated column descriptions.
 */
export function projectPivotTable(
    source: DataTable,
    options: ResolvedPivotOptions,
    lang: PivotLangOptions
): PivotProjectionResult {
    const sourceColumns = source.columns;
    validateFields(sourceColumns, options);

    const { rows: rowFields, columns: columnFields, values } = options;
    const sourceRowCount = source.getRowCount();
    const withTotalColumn = (
        columnFields.length > 0 && options.grandTotalColumn !== false
    );
    const withGrandTotalRow = options.grandTotalRow !== false;

    const rowNodes = new Map<string, PivotRowNode>();
    const columnPathsByKey = new Map<string, DataTableCellType[]>();
    const buckets = new Map<string, number[]>();

    rowNodes.set('', { path: [], childKeys: [] });

    /**
     * Adds a source row to the bucket of one pivot cell.
     *
     * @param rowKey
     * Key of the row field value path.
     *
     * @param columnKey
     * Key of the column field value path.
     *
     * @param rowIndex
     * Source row index.
     */
    const addToBucket = (
        rowKey: string,
        columnKey: string,
        rowIndex: number
    ): void => {
        const bucketKey = rowKey + BUCKET_KEY_SEPARATOR + columnKey;
        const bucket = buckets.get(bucketKey);

        if (bucket) {
            bucket.push(rowIndex);
            return;
        }

        buckets.set(bucketKey, [rowIndex]);
    };

    for (let rowIndex = 0; rowIndex < sourceRowCount; ++rowIndex) {
        const columnPath: DataTableCellType[] = [];
        let columnKey = '';

        for (let i = 0, iEnd = columnFields.length; i < iEnd; ++i) {
            const fieldValue =
                sourceColumns[columnFields[i]][rowIndex] as DataTableCellType;

            columnPath.push(fieldValue);
            columnKey += getKeyPart(fieldValue);
        }

        if (!columnPathsByKey.has(columnKey)) {
            columnPathsByKey.set(columnKey, columnPath);
        }

        const rowPath: DataTableCellType[] = [];
        let rowKey = '';
        let parentKey = '';

        if (withGrandTotalRow) {
            addToBucket('', columnKey, rowIndex);

            if (withTotalColumn) {
                addToBucket('', TOTAL_COLUMN_KEY, rowIndex);
            }
        }

        for (let i = 0, iEnd = rowFields.length; i < iEnd; ++i) {
            const fieldValue =
                sourceColumns[rowFields[i]][rowIndex] as DataTableCellType;

            rowPath.push(fieldValue);
            rowKey += getKeyPart(fieldValue);

            if (!rowNodes.has(rowKey)) {
                rowNodes.set(rowKey, {
                    path: rowPath.slice(),
                    childKeys: []
                });
                rowNodes.get(parentKey)?.childKeys.push(rowKey);
            }

            addToBucket(rowKey, columnKey, rowIndex);

            if (withTotalColumn) {
                addToBucket(rowKey, TOTAL_COLUMN_KEY, rowIndex);
            }

            parentKey = rowKey;
        }
    }

    // Column field value paths, ascending on every level.
    const columnKeys = Array.from(columnPathsByKey.keys()).sort(
        (a, b): number => comparePaths(
            columnPathsByKey.get(a) as DataTableCellType[],
            columnPathsByKey.get(b) as DataTableCellType[]
        )
    );

    const columnMetaById: Record<string, PivotColumnMeta> = {};
    const bindingById: Record<string, PivotColumnBinding> = {};
    const columnIdsByPathIndex: string[][] = [];
    const totalColumnIds: string[] = [];

    for (let i = 0, iEnd = columnKeys.length; i < iEnd; ++i) {
        const columnPath = columnPathsByKey.get(
            columnKeys[i]
        ) as DataTableCellType[];
        const columnIds: string[] = [];

        for (let j = 0, jEnd = values.length; j < jEnd; ++j) {
            const columnId = `pivot-${i}-${values[j].columnId}`;
            const meta: PivotColumnMeta = {
                columnPath: columnPath.slice(),
                valueColumnId: values[j].columnId,
                isTotal: false
            };

            columnIds.push(columnId);
            columnMetaById[columnId] = meta;
            bindingById[columnId] = {
                columnKey: columnKeys[i],
                meta,
                value: values[j]
            };
        }

        columnIdsByPathIndex.push(columnIds);
    }

    if (withTotalColumn) {
        for (let j = 0, jEnd = values.length; j < jEnd; ++j) {
            const columnId = `pivot-total-${values[j].columnId}`;
            const meta: PivotColumnMeta = {
                columnPath: [],
                valueColumnId: values[j].columnId,
                isTotal: true
            };

            totalColumnIds.push(columnId);
            columnMetaById[columnId] = meta;
            bindingById[columnId] = {
                columnKey: TOTAL_COLUMN_KEY,
                meta,
                value: values[j]
            };
        }
    }

    // Depth-first order of the row field value tree.
    const orderedRowKeys: string[] = [];

    /**
     * Appends the sorted descendants of a row node to the row order.
     *
     * @param key
     * Key of the row field value path.
     */
    const visit = (key: string): void => {
        const node = rowNodes.get(key);
        if (!node) {
            return;
        }

        node.childKeys.sort((a, b): number => comparePaths(
            (rowNodes.get(a) as PivotRowNode).path,
            (rowNodes.get(b) as PivotRowNode).path
        ));

        for (let i = 0, iEnd = node.childKeys.length; i < iEnd; ++i) {
            orderedRowKeys.push(node.childKeys[i]);
            visit(node.childKeys[i]);
        }
    };
    visit('');

    const generatedColumnIds = (
        options.grandTotalColumn === 'start' ?
            totalColumnIds.concat(...columnIdsByPathIndex) :
            ([] as string[]).concat(...columnIdsByPathIndex, totalColumnIds)
    );

    const projectedColumns: Record<string, DataTableColumn> = {};
    const pathValues: string[] = [];

    projectedColumns[PIVOT_ROWS_COLUMN_ID] = pathValues;
    for (let i = 0, iEnd = generatedColumnIds.length; i < iEnd; ++i) {
        projectedColumns[generatedColumnIds[i]] = [];
    }

    for (let i = 0, iEnd = orderedRowKeys.length; i < iEnd; ++i) {
        const rowKey = orderedRowKeys[i];
        const node = rowNodes.get(rowKey) as PivotRowNode;
        const isSubtotal = node.childKeys.length > 0;

        pathValues.push(
            node.path
                .map((value): string => getPathSegment(value, lang))
                .join(PIVOT_PATH_SEPARATOR)
        );

        for (let j = 0, jEnd = generatedColumnIds.length; j < jEnd; ++j) {
            const columnId = generatedColumnIds[j];
            const binding = bindingById[columnId];

            (projectedColumns[columnId] as DataTableCellType[]).push(
                isSubtotal && !options.subtotals ?
                    null :
                    aggregateCell(
                        binding,
                        sourceColumns[binding.value.columnId],
                        buckets.get(
                            rowKey + BUCKET_KEY_SEPARATOR + binding.columnKey
                        ) || [],
                        node.path,
                        isSubtotal,
                        false
                    )
            );
        }
    }

    let grandTotalValues: Record<string, DataTableCellType> | undefined;

    if (withGrandTotalRow) {
        grandTotalValues = {};

        for (let j = 0, jEnd = generatedColumnIds.length; j < jEnd; ++j) {
            const columnId = generatedColumnIds[j];
            const binding = bindingById[columnId];

            grandTotalValues[columnId] = aggregateCell(
                binding,
                sourceColumns[binding.value.columnId],
                buckets.get(BUCKET_KEY_SEPARATOR + binding.columnKey) || [],
                [],
                false,
                true
            );
        }
    }

    const headers = buildColumnHeaders(
        columnKeys.map(
            (key): DataTableCellType[] =>
                columnPathsByKey.get(key) as DataTableCellType[]
        ),
        columnIdsByPathIndex,
        lang
    );

    if (withTotalColumn) {
        const totalHeader: GroupedHeaderOptions = {
            format: lang.grandTotal,
            columns: totalColumnIds.map(
                (columnId): GroupedHeaderOptions => ({ columnId })
            )
        };

        if (options.grandTotalColumn === 'start') {
            headers.unshift(totalHeader);
        } else {
            headers.push(totalHeader);
        }
    }

    return {
        table: new DataTable({ columns: projectedColumns }),
        header: ([PIVOT_ROWS_COLUMN_ID] as Array<GroupedHeaderOptions|string>)
            .concat(headers),
        generatedColumnIds,
        columnMetaById,
        grandTotalValues
    };
}

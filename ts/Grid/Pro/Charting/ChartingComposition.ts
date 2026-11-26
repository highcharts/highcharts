/* *
 *
 *  Grid Charting composition
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 *  Authors:
 *  - Markus Barstad
 *
 * */

'use strict';


/* *
 *
 *  Imports
 *
 * */

import type Grid from '../../Core/Grid';
import type {
    CellMenuTarget,
    ElementMenuTarget,
    MenuTarget
} from '../../Core/ContextMenu/ContextMenuTarget';
import type { MenuItemOptions } from '../../Core/ContextMenu/ContextMenuOptions';
import type {
    AfterChartCreateEvent,
    BeforeChartCreateEvent,
    CreateChartOptions
} from './ChartingOptions';

import Charting from './Charting.js';
import { defaultOptions } from '../../Core/Defaults.js';
import Globals from '../../Core/Globals.js';
import HeaderCell from '../../Core/Table/Header/HeaderCell.js';
import { registerMenuItem } from '../../Core/ContextMenu/ContextMenuRegistry.js';
import { addEvent, merge, pushUnique } from '../../../Shared/Utilities.js';


/* *
 *
 *  Composition
 *
 * */

/**
 * Extends the Grid with creating charts from its data.
 *
 * @param GridClass
 * The class to extend.
 */
export function compose(
    GridClass: typeof Grid
): void {
    if (!pushUnique(Globals.composed, 'Charting')) {
        return;
    }

    merge(true, defaultOptions, {
        charting: Charting.defaultOptions,
        lang: {
            charting: {
                chartColumn: 'Chart this column',
                chartTypes: {
                    area: 'Area chart',
                    bar: 'Bar chart',
                    bubble: 'Bubble chart',
                    column: 'Column chart',
                    line: 'Line chart',
                    pie: 'Pie chart',
                    scatter: 'Scatter chart',
                    stackedColumn: 'Stacked column chart'
                },
                closeChart: 'Close chart',
                createChart: 'Create chart'
            }
        },
        rendering: {
            icons: {
                chart: {
                    width: 16,
                    height: 16,
                    viewBox: '0 0 24 24',
                    children: [{
                        d: 'M3 3v18h18M8 17v-5m5 5V8m5 9v-9',
                        'stroke-width': 2
                    }]
                }
            }
        }
    });

    registerMenuItem<CellMenuTarget>('createChart', {
        defaultIn: ['cell'],
        icon: 'chart',
        items: (context): Array<MenuItemOptions<CellMenuTarget>> =>
            getChartTypeItems(context.grid, context.target.column.id),
        label: (context): string =>
            context.grid.options?.lang?.charting?.createChart || '',
        targets: ['cell'],
        visible: (context): boolean => isMenuEnabled(context.grid)
    });

    addEvent(GridClass, 'beforeLoad', initCharting);
    addEvent(GridClass, 'beforeDestroy', destroyCharting);
    addEvent(GridClass, 'beforeRenderViewport', detachHeaderMenus);
    addEvent(HeaderCell, 'afterRender', attachHeaderMenu);
    addEvent(GridClass, 'beforeChartCreate', onBeforeChartCreate);
    addEvent(GridClass, 'afterChartCreate', onAfterChartCreate);
}

/**
 * Returns whether the context menus offer charts.
 *
 * @param grid
 * The Grid.
 *
 * @return
 * Whether `charting.enabled` is set and Highcharts is loaded.
 */
function isMenuEnabled(grid: Grid): boolean {
    return !!grid.options?.charting?.enabled && !!Charting.H;
}

/**
 * Returns what a context menu opened on a column charts: the column with the
 * first non-numeric column as its dimension, or, for a non-numeric column,
 * the column with every numeric column. The selected rows are charted if
 * any, otherwise all rows.
 *
 * @param grid
 * The Grid.
 *
 * @param columnId
 * The id of the column the menu was opened on.
 *
 * @return
 * The columns and rows to chart.
 */
function getMenuChartData(
    grid: Grid,
    columnId: string
): CreateChartOptions {
    const columnIds = grid.enabledColumns || [];
    const isNumeric = (id: string): boolean =>
        grid.viewport?.getColumn(id)?.dataType === 'number';
    const selected = grid.rowSelection?.getSelectedRowIds();
    let columns: Array<string>;

    if (isNumeric(columnId)) {
        const dimension = columnIds.find((id): boolean => !isNumeric(id));
        columns = dimension ? [dimension, columnId] : [columnId];
    } else {
        columns = [columnId, ...columnIds.filter(isNumeric)];
    }

    return {
        columns,
        rows: selected?.length ? selected : void 0
    };
}

/**
 * Returns the menu items creating a chart from a column, one per recommended
 * chart type, best match first.
 *
 * @param grid
 * The Grid.
 *
 * @param columnId
 * The id of the column the menu was opened on.
 *
 * @return
 * The menu items, empty when no chart type fits.
 */
function getChartTypeItems<T extends MenuTarget>(
    grid: Grid,
    columnId: string
): Array<MenuItemOptions<T>> {
    const { charting } = grid;
    const data = getMenuChartData(grid, columnId);
    const labels = grid.options?.lang?.charting?.chartTypes;

    return (charting?.getRecommendations(data.columns, data.rows) || []).map(
        (type): MenuItemOptions<T> => ({
            label: labels?.[type] || type,
            onClick: (): void => {
                charting?.createChart({ ...data, type });
            }
        })
    );
}

/**
 * Gives the header cell of a column a context menu charting the column, once
 * per header cell.
 */
function attachHeaderMenu(this: HeaderCell): void {
    const grid = this.row.viewport.grid;
    const charting = grid.charting;

    if (
        !charting ||
        !this.column ||
        charting.headerMenus.has(this) ||
        !isMenuEnabled(grid)
    ) {
        return;
    }

    charting.headerMenus.set(this, grid.contextMenu.attach(this.htmlElement, {
        items: [{
            icon: 'chart',
            label: (): string =>
                grid.options?.lang?.charting?.chartColumn || '',
            // Read when the menu opens, as the cell may show another column
            // by then.
            items: (): Array<MenuItemOptions<ElementMenuTarget>> => (
                this.column ? getChartTypeItems(grid, this.column.id) : []
            )
        }]
    }));
}

/**
 * Detaches the context menus of the column headers before the viewport is
 * rendered again with new header cells.
 */
function detachHeaderMenus(this: Grid): void {
    this.charting?.detachHeaderMenus();
}

/**
 * Creates the charting controller of the Grid.
 */
function initCharting(this: Grid): void {
    this.charting = new Charting(this);
}

/**
 * Destroys the charting controller of the Grid.
 */
function destroyCharting(this: Grid): void {
    this.charting?.destroy();
}

/**
 * Calls the `beforeChartCreate` event callback from the options.
 *
 * @param e
 * The event payload.
 */
function onBeforeChartCreate(this: Grid, e: BeforeChartCreateEvent): void {
    this.options?.events?.beforeChartCreate?.call(this, e);
}

/**
 * Calls the `afterChartCreate` event callback from the options.
 *
 * @param e
 * The event payload.
 */
function onAfterChartCreate(this: Grid, e: AfterChartCreateEvent): void {
    this.options?.events?.afterChartCreate?.call(this, e);
}


/* *
 *
 *  Default Export
 *
 * */

export default {
    compose
} as const;

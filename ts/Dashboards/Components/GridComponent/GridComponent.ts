/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 *  Authors:
 *  - Karol Kołodziej
 *  - Dawid Draguła
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type Board from '../../Board';
import type Cell from '../../Layout/Cell';
import type { Grid, GridNamespace } from '../../Plugins/GridTypes';
import type { Options } from './GridComponentOptions';
import type DataTable from '../../../Data/DataTable';

import type { EventTypes as ComponentEventTypes } from '../Component';

import Component from '../Component.js';
import GridSyncs from './GridSyncs/GridSyncs.js';
import GridComponentDefaults from './GridComponentDefaults.js';
import { hasDataTableProvider } from './GridDataProvider.js';
import DU from '../../Utilities.js';
import SidebarPopup from '../../EditMode/SidebarPopup';
import { diffObjects, getStyle, merge } from '../../../Shared/Utilities.js';
const { deepClone } = DU;

/* *
 *
 *  Class
 *
 * */

/**
 * Grid Component for Highcharts Dashboards.
 * @private
 */
class GridComponent extends Component {

    /* *
     *
     *  Static Properties
     *
     * */

    /**
     * Predefined sync config for the Grid Component.
     */
    public static predefinedSyncConfig = GridSyncs;

    /**
     * The namespace of the Grid Component.
     */
    public static GridNamespace?: GridNamespace;

    /**
     * The default options for the Grid Component.
     */
    public static defaultOptions = merge(
        Component.defaultOptions,
        GridComponentDefaults
    );

    /* *
     *
     *  Properties
     *
     * */

    /**
     * The Grid that is rendered in the Grid Component.
     */
    public grid?: Grid;

    /**
     * The options of the Grid Component.
     */
    public options: Options;


    /* *
     *
     *  Constructor
     *
     * */

    constructor(
        cell: Cell,
        options: Partial<Options>,
        board?: Board
    ) {
        options = merge(GridComponent.defaultOptions, options);
        super(cell, options, board);

        this.options = options as Options;
        this.type = 'Grid';

        this.setOptions();
    }

    /* *
     *
     *  Functions
     *
     * */

    public override async update(
        options: Partial<Options>,
        shouldRerender: boolean = true
    ): Promise<void> {
        const previousGridDataTableId = this.getGridDataTable(true)?.id;

        // Avoid triggering GridComponent.render() from Component.update().
        // That render starts a fire-and-forget renderViewport() which can
        // race with the awaited redraw() below when connector data changes.
        await super.update(options, false);
        this.setOptions();
        const grid = this.grid;
        const table = this.getDataTable();

        if (
            grid &&
            this.options.connector &&
            previousGridDataTableId !== table?.id
        ) {
            this.recreateGrid(shouldRerender);
            this.emit({ type: 'afterUpdate' });
            return;
        }

        if (grid && shouldRerender) {
            super.render();
        }

        if (grid) {
            void grid.update(
                options.gridOptions,
                false
            );
            if (
                // #24067 - Update dataTable in options when changed.
                options.gridOptions?.dataTable &&
                this.options.gridOptions
            ) {
                this.options.gridOptions.dataTable =
                    options.gridOptions.dataTable;
            }

            await grid.redraw();
            this.options.gridOptions = this.getGridOptionsSnapshot(grid);

            if (shouldRerender) {
                this.finalizeGridRender();
            }
        } else if (shouldRerender) {
            this.render();
        }

        this.emit({ type: 'afterUpdate' });
    }

    public override render(): this {
        super.render();
        if (!this.grid) {
            this.grid = this.constructGrid();
        } else {
            void this.grid.renderViewport();
        }

        this.finalizeGridRender();

        return this;
    }

    public override resize(
        width?: number | string | null,
        height?: number | string | null
    ): void {
        if (height) {
            this.contentElement.style.minHeight = '0';
        } else if (height === null) {
            this.contentElement.style.removeProperty('min-height');
        }

        this.resizeDynamicContent(width, height);
        this.grid?.viewport?.reflow();
    }

    public override onTableChanged(): void {
        const { grid } = this;
        if (!grid) {
            return;
        }

        // Check if the grid is of the legacy version (not using the data
        // provider).
        if (!('dataProvider' in grid)) {
            // eslint-disable-next-line no-console
            console.warn(
                'GridComponent: Legacy Grid detected. Using legacy handler ' +
                'for table changes. Consider upgrading the Highcharts Grid ' +
                'Library to the latest version.'
            );
            this.onTableChangedLegacy();
            return;
        }

        if (
            !grid?.dataProvider ||
            !hasDataTableProvider(grid.dataProvider) ||
            !this.connectorHandlers?.length
        ) {
            return;
        }

        const dataTable = this.getDataTable()?.getModified();
        if (!dataTable) {
            this.recreateGrid(true);
            return;
        }

        if (!grid.options?.header) {
            // If the header is not defined, we need to check if the column
            // names have changed, so we can update the whole grid. If they
            // have not changed, we can just update the rows (more efficient).

            const newColumnIds = dataTable.getColumnIds();
            const { enabledColumns, columnPolicy } = grid;

            let index = 0;
            for (const newColumn of newColumnIds) {
                if (
                    columnPolicy.getIndividualColumnOptions(newColumn)
                        ?.enabled === false
                ) {
                    continue;
                }

                if (enabledColumns?.[index] !== newColumn) {
                    // If the visible columns have changed,
                    // update the whole grid.
                    this.recreateGrid(true);
                    return;
                }

                index++;
            }
        }

        if (this.getGridDataTable() !== dataTable) {
            this.recreateGrid(true);
            return;
        }

        // Data has changed and the whole grid is not re-rendered, so mark in
        // the querying that data table was modified.
        grid.querying.shouldBeUpdated = true;

        // If the column names have not changed, just update the rows.
        void grid.viewport?.updateRows();
    }

    /**
     * Legacy handler for table changes.
     */
    private onTableChangedLegacy(): void {
        const { grid } = this;
        if (!grid) {
            return;
        }

        const dataTable = this.getDataTable()?.getModified();
        if (!dataTable) {
            void grid.update({ dataTable: void 0 });
            return;
        }

        if (!grid.options?.header) {
            // If the header is not defined, we need to check if the column
            // names have changed, so we can update the whole grid. If they
            // have not changed, we can just update the rows (more efficient).

            const newColumnIds = dataTable.getColumnIds();
            const { enabledColumns, columnPolicy } = grid;

            let index = 0;
            for (const newColumn of newColumnIds) {
                if (
                    columnPolicy.getIndividualColumnOptions(newColumn)
                        ?.enabled === false
                ) {
                    continue;
                }

                if (enabledColumns?.[index] !== newColumn) {
                    // If the visible columns have changed,
                    // update the whole grid.
                    void grid.update({ dataTable });
                    return;
                }

                index++;
            }
        }

        // Workaround for legacy Grid component.
        (grid as unknown as { dataTable: typeof dataTable }).dataTable =
            dataTable;

        // Data has changed and the whole grid is not re-rendered, so mark in
        // the querying that data table was modified.
        grid.querying.shouldBeUpdated = true;

        // If the column names have not changed, just update the rows.
        void grid.viewport?.updateRows();
    }

    public getEditableOptions(): Options {
        const componentOptions = this.options;
        const gridOptions = this.grid ?
            this.getGridOptionsSnapshot(this.grid) :
            void 0;

        return deepClone(
            merge(
                {
                    gridOptions: gridOptions
                },
                componentOptions
            ),
            ['editableOptions', 'dataTable']
        );
    }

    public override getOptionsOnDrop(sidebar: SidebarPopup): Partial<Options> {
        const connectorsIds = sidebar.editMode.board.dataPool.getConnectorIds();
        let options: Partial<Options> = {
            type: 'Grid'
        };

        if (connectorsIds.length) {
            options = {
                ...options,
                connector: {
                    id: connectorsIds[0]
                }
            };
        }

        return options;
    }

    /**
     * Get the Grid Component's options.
     *
     * @returns
     * Grid Component's options.
     *
     * @internal
     */
    public override getOptions(): Partial<Options> {
        const optionsCopy = merge(this.options);
        optionsCopy.gridOptions = this.grid ?
            this.getGridOptionsSnapshot(this.grid) :
            void 0;

        // Remove the table from the options copy if the connector is set.
        if (optionsCopy.connector?.id) {
            delete optionsCopy.gridOptions?.dataTable;
        } else if (optionsCopy.gridOptions?.dataTable?.id) {
            optionsCopy.gridOptions.dataTable = {
                columns: optionsCopy.gridOptions.dataTable.columns
            };
        }

        return {
            ...diffObjects(optionsCopy, GridComponent.defaultOptions),
            type: 'Grid'
        };
    }


    /**
     * Destroys the data grid component.
     */
    public override destroy(): void {
        this.sync.stop();
        this.grid?.destroy();
        super.destroy();
    }

    /**
     * Sets the options for the data grid component content container.
     */
    private setOptions(): void {
        const options = this.options,
            gridClassName = options.gridClassName,
            gridID = options.gridID;

        if (gridClassName) {
            this.contentElement.classList.value =
                GridComponentDefaults.gridClassName + ' ' + gridClassName;
        }

        if (gridID) {
            this.contentElement.id = gridID;
        }
    }

    private finalizeGridRender(): void {
        const { grid } = this;
        if (!grid) {
            return;
        }

        grid.initialContainerHeight =
            getStyle(
                this.parentElement,
                'height',
                true
            ) || 0;

        this.sync.start();
        this.emit({ type: 'afterRender' });
    }

    private getGridOptionsSnapshot(grid: Grid): Options['gridOptions'] {
        const gridOptions = merge(grid.getOptions());

        if (!this.options.connector) {
            return gridOptions;
        }

        delete gridOptions.dataTable;

        if (gridOptions.data?.providerType === 'local') {
            delete gridOptions.data.dataTable;
            delete gridOptions.data.columns;

            if (
                Object.keys(gridOptions.data).length === 1 &&
                gridOptions.data.providerType === 'local'
            ) {
                delete gridOptions.data;
            }
        }

        return gridOptions;
    }

    private getGridOptionsWithConnectorData(): Options['gridOptions'] {
        const gridOptions = merge(this.options.gridOptions) ?? {};

        if (!this.options.connector) {
            return gridOptions;
        }

        delete gridOptions.dataTable;

        if (gridOptions.data?.providerType === 'local') {
            delete gridOptions.data.dataTable;
            delete gridOptions.data.columns;

            if (
                Object.keys(gridOptions.data).length === 1 &&
                gridOptions.data.providerType === 'local'
            ) {
                delete gridOptions.data;
            }
        }

        const dataTable = this.getDataTable();
        if (dataTable) {
            gridOptions.data = merge(
                gridOptions.data?.providerType === 'local' ?
                    gridOptions.data :
                    {},
                {
                    providerType: 'local',
                    dataTable: dataTable.getModified()
                }
            );
        }

        return gridOptions;
    }

    private recreateGrid(shouldRerender: boolean): void {
        this.sync.stop();
        this.grid?.destroy();
        delete this.grid;

        if (shouldRerender) {
            this.render();
            return;
        }

        this.grid = this.constructGrid();
        this.finalizeGridRender();
    }

    private getGridDataTable(presentation = false): DataTable | undefined {
        const dataProvider = this.grid?.dataProvider;

        return hasDataTableProvider(dataProvider) ?
            dataProvider.getDataTable(presentation) :
            void 0;
    }

    /**
     * Function to create the Grid.
     *
     * @returns The Grid.
     */
    private constructGrid(): Grid {
        const DGN = GridComponent.GridNamespace;
        if (!DGN) {
            throw new Error('Grid not connected.');
        }

        const gridOptions = this.getGridOptionsWithConnectorData();

        const gridInstance =
            new DGN.Grid(this.contentElement, gridOptions ?? {});

        this.options.gridOptions = this.getGridOptionsSnapshot(gridInstance);

        return gridInstance;
    }
}

/* *
 *
 *  Type Declarations
 *
 * */

/** @private */
export type ComponentType = GridComponent;

/** @private */
export type ChartComponentEvents = ComponentEventTypes;

/* *
 *
 *  Default Export
 *
 * */

export default GridComponent;

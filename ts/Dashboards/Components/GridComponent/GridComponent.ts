/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 *  Authors:
 *  - Karol Kolodziej
 *  - Dawid Dragula
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

import Component from '../Component.js';
import GridSyncs from './GridSyncs/GridSyncs.js';
import GridComponentDefaults from './GridComponentDefaults.js';
import U from '../../../Core/Utilities.js';
import DU from '../../Utilities.js';
import SidebarPopup from '../../EditMode/SidebarPopup';
const {
    merge,
    diffObjects,
    getStyle
} = U;
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

    public override async update(options: Partial<Options>): Promise<void> {
        await super.update(options);
        this.setOptions();

        if (this.grid) {
            this.grid.update(
                options.gridOptions,
                false
            );

            const table = this.getDataTable();

            if (this.grid?.viewport?.dataTable?.id !== table?.id) {
                this.grid.update({
                    dataTable: table?.getModified()
                }, false);
            }

            await this.grid.redraw();
        }

        this.emit({ type: 'afterUpdate' });
    }

    public override render(): this {
        super.render();
        if (!this.grid) {
            this.grid = this.constructGrid();
        } else {
            this.grid.renderViewport();
        }

        this.grid.initialContainerHeight =
            getStyle(
                this.parentElement,
                'height',
                true
            ) || 0;

        this.sync.start();
        this.emit({ type: 'afterRender' });

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

        const dataTable = this.getDataTable()?.getModified();
        if (!dataTable) {
            grid.update({ dataTable: void 0 });
            return;
        }

        if (!grid.options?.header) {
            // If the header is not defined, we need to check if the column
            // names have changed, so we can update the whole grid. If they
            // have not changed, we can just update the rows (more efficient).

            const newColumnIds = dataTable.getColumnIds();
            const { columnOptionsMap, enabledColumns } = grid;

            let index = 0;
            for (const newColumn of newColumnIds) {
                if (columnOptionsMap[newColumn]?.options?.enabled === false) {
                    continue;
                }

                if (enabledColumns?.[index] !== newColumn) {
                    // If the visible columns have changed,
                    // update the whole grid.
                    grid.update({ dataTable });
                    return;
                }

                index++;
            }
        }

        grid.dataTable = dataTable;

        // Data has changed and the whole grid is not re-rendered, so mark in
        // the querying that data table was modified.
        grid.querying.shouldBeUpdated = true;

        // If the column names have not changed, just update the rows.
        grid.viewport?.updateRows();
    }

    public getEditableOptions(): Options {
        const componentOptions = this.options;
        const gridOptions = this.grid?.options;

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
        optionsCopy.gridOptions = this.grid?.getOptions();

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

        const dataTable = this.getDataTable(),
            options = this.options,
            gridOptions = options.gridOptions;

        if (!gridOptions) {
            throw new Error('Grid options are not set.');
        }

        if (dataTable) {
            gridOptions.dataTable = dataTable.getModified();
        }

        const gridInstance =
            new DGN.Grid(this.contentElement, gridOptions);

        this.options.gridOptions = gridInstance.options;

        return gridInstance;
    }
}

/* *
 *
 *  Class Namespace
 *
 * */

namespace GridComponent {

    /* *
     *
     *  Declarations
     *
     * */

    /** @private */
    export type ComponentType = GridComponent;

    /** @private */
    export type ChartComponentEvents = Component.EventTypes;
}

/* *
 *
 *  Default Export
 *
 * */

export default GridComponent;

/* *
 *
 *  (c) 2009-2025 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
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
import type { Grid, GridNamespace } from '../../Plugins/DataGridTypes';
import type Options from './DataGridComponentOptions';

import Component from '../Component.js';
import DataGridSyncs from './DataGridSyncs/DataGridSyncs.js';
import GridComponentDefaults from './DataGridComponentDefaults.js';
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
class DataGridComponent extends Component {

    /* *
     *
     *  Static Properties
     *
     * */

    /**
     * Predefined sync config for the Grid Component.
     */
    public static predefinedSyncConfig = DataGridSyncs;

    /**
     * The namespace of the Grid Component.
     * @deprecated
     * DataGrid will be removed in behalf of Grid in the next major version.
     */
    public static get DataGridNamespace(): GridNamespace|undefined {
        return DataGridComponent.GridNamespace;
    }

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
     * @deprecated
     * DataGrid will be removed in behalf of Grid in the next major version.
     */
    public get dataGrid(): Grid|undefined {
        return this.grid;
    }

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
        options = merge(DataGridComponent.defaultOptions, options);
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
                merge(
                    {},
                    options.gridOptions,
                    options.dataGridOptions
                ),
                false
            );

            if (
                this.grid?.viewport?.dataTable?.id !==
                this.getFirstConnector()?.table?.id
            ) {
                this.grid.update({
                    dataTable: this.getFirstConnector()?.table?.modified
                }, false);
            }

            this.grid.renderViewport();
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
        this.grid?.update({
            dataTable: this.getFirstConnector()?.table?.modified
        });
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
            cell: '',
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

        // Remove the table from the options copy if the connector is set.
        const optionsCopy = merge(this.options);
        if (optionsCopy.connector?.id) {
            delete optionsCopy.gridOptions?.dataTable;
        } else if (optionsCopy.gridOptions?.dataTable?.id) {
            optionsCopy.gridOptions.dataTable = {
                columns: optionsCopy.gridOptions.dataTable.columns
            };
        }

        return {
            ...diffObjects(optionsCopy, DataGridComponent.defaultOptions),
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
            gridClassName = options.gridClassName || options.dataGridClassName,
            gridID = options.gridID || options.dataGridID;

        if (gridClassName) {
            this.contentElement.classList.value =
                GridComponentDefaults.className + ' ' +
                gridClassName;
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
        const DGN = DataGridComponent.GridNamespace;
        if (!DGN) {
            throw new Error('Grid not connected.');
        }

        const dataTable = this.getFirstConnector()?.getTable(this.dataTableKey),
            options = this.options,
            gridOptions = merge(
                {},
                options.gridOptions,
                options.dataGridOptions
            );

        if (dataTable) {
            gridOptions.dataTable = dataTable.modified;
        }

        const dataGridInstance =
            new DGN.Grid(this.contentElement, gridOptions);

        this.options.gridOptions = dataGridInstance.options;

        return dataGridInstance;
    }
}

/* *
 *
 *  Class Namespace
 *
 * */

namespace DataGridComponent {

    /* *
     *
     *  Declarations
     *
     * */

    /** @private */
    export type ComponentType = DataGridComponent;

    /** @private */
    export type ChartComponentEvents = Component.EventTypes;
}

/* *
 *
 *  Default Export
 *
 * */

export default DataGridComponent;

/* *
 *
 *  (c) 2009-2024 Highsoft AS
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
import type { DataGrid, DataGridNamespace } from '../../Plugins/DataGridTypes';
import type Options from './DataGridComponentOptions';

import Component from '../Component.js';
import DataGridSyncs from './DataGridSyncs/DataGridSyncs.js';
import DataGridComponentDefaults from './DataGridComponentDefaults.js';
import U from '../../../Core/Utilities.js';
const {
    merge,
    diffObjects
} = U;

/* *
 *
 *  Class
 *
 * */

/**
 * DataGrid component for Highcharts Dashboards.
 * @private
 */
class DataGridComponent extends Component {

    /* *
     *
     *  Static Properties
     *
     * */

    /**
     * Predefined sync config for the DataGrid component.
     */
    public static predefinedSyncConfig = DataGridSyncs;

    /**
     * The namespace of the DataGrid component.
     */
    public static DataGridNamespace?: DataGridNamespace;

    /**
     * The default options for the DataGrid component.
     */
    public static defaultOptions = merge(
        Component.defaultOptions,
        DataGridComponentDefaults
    );

    /* *
     *
     *  Static Functions
     *
     * */

    /**
     * Function to create a DataGrid component from JSON.
     *
     * @param json
     * The JSON to create the DataGrid component from.
     *
     * @param cell
     * The cell to create the DataGrid component in.
     *
     * @returns
     * The DataGrid component created from the JSON.
     */
    public static fromJSON(
        json: DataGridComponent.ClassJSON,
        cell: Cell
    ): DataGridComponent {
        const options = json.options;
        const dataGridOptions = JSON.parse(json.options.dataGridOptions || '');

        const component = new DataGridComponent(
            cell,
            merge<Options>(options as any, { dataGridOptions })
        );

        component.emit({
            type: 'fromJSON',
            json
        });

        return component;
    }

    /* *
     *
     *  Properties
     *
     * */

    /**
     * The DataGrid that is rendered in the DataGrid component.
     */
    public dataGrid?: DataGrid;

    /**
     * The options of the DataGrid component.
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
        this.type = 'DataGrid';

        if (this.options.dataGridClassName) {
            this.contentElement.classList.add(this.options.dataGridClassName);
        }

        if (this.options.dataGridID) {
            this.contentElement.id = this.options.dataGridID;
        }
    }

    /* *
     *
     *  Functions
     *
     * */

    public override async update(options: Partial<Options>): Promise<void> {
        await super.update(options);

        if (this.dataGrid) {
            this.dataGrid.update(this.options.dataGridOptions ?? {}, false);

            if (
                this.dataGrid?.viewport?.dataTable?.id !==
                this.getFirstConnector()?.table?.id
            ) {
                this.dataGrid.update({
                    table: this.getFirstConnector()?.table?.modified
                }, false);
            }

            this.dataGrid.renderViewport();
        }

        this.emit({ type: 'afterUpdate' });
    }

    public render(): this {
        super.render();
        if (!this.dataGrid) {
            this.dataGrid = this.constructDataGrid();
        } else {
            this.dataGrid.renderViewport();
        }

        this.sync.start();
        this.emit({ type: 'afterRender' });

        return this;
    }

    public onTableChanged(): void {
        this.dataGrid?.update({
            table: this.getFirstConnector()?.table?.modified
        });
    }

    /**
     * Get the DataGrid component's options.
     *
     * @returns
     * The JSON of DataGrid component's options.
     *
     * @internal
     */
    public getOptions(): Partial<Options> {
        return {
            ...diffObjects(this.options, DataGridComponent.defaultOptions),
            type: 'DataGrid'
        };
    }

    /**
     * Destroys the data grid component.
     */
    public override destroy(): void {
        this.dataGrid?.destroy();
        super.destroy();
    }

    /**
     * Function to create the DataGrid.
     *
     * @returns The DataGrid.
     */
    private constructDataGrid(): DataGrid {
        const DGN = DataGridComponent.DataGridNamespace;
        if (!DGN) {
            throw new Error('DataGrid not connected.');
        }

        const dataTable = this.getFirstConnector()?.table;
        const dataGridOptions = this.options.dataGridOptions ?? {};
        if (dataTable) {
            dataGridOptions.table = dataTable.modified;
        }

        return new DGN.DataGrid(this.contentElement, dataGridOptions);
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
    export type ChartComponentEvents = JSONEvent | Component.EventTypes;

    /** @private */
    export type JSONEvent = Component.Event<
    'toJSON' | 'fromJSON',
    {
        json: ClassJSON;
    }
    >;

    /** @private */
    export interface ComponentJSONOptions
        extends Component.ComponentOptionsJSON {

        /** @private */
        dataGridOptions?: string;

        /** @private */
        chartClassName?: string;

        /** @private */
        chartID?: string;
    }

    /** @private */
    export interface ClassJSON extends Component.JSON {
        /** @private */
        options: ComponentJSONOptions;
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default DataGridComponent;

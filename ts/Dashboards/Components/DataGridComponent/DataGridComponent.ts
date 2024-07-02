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
import type BaseDataGridOptions from '../../../DataGrid/DataGridOptions';
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

    /** @private */
    public static DataGridNamespace?: DataGridNamespace;

    /** @private */
    public static defaultOptions = merge(
        Component.defaultOptions,
        DataGridComponentDefaults
    );

    /* *
     *
     *  Static Functions
     *
     * */

    /** @private */
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

    /** @private */
    public dataGrid?: DataGrid;

    /** @private */
    public dataGridOptions: Partial<BaseDataGridOptions>;

    /** @private */
    public options: Options;

    /** @private */
    private connectorListeners: Array<Function>;

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

        this.connectorListeners = [];
        this.options = options as Options;
        this.type = 'DataGrid';

        if (this.options.dataGridClassName) {
            this.contentElement.classList.add(this.options.dataGridClassName);
        }
        if (this.options.dataGridID) {
            this.contentElement.id = this.options.dataGridID;
        }

        this.dataGridOptions = (
            this.options.dataGridOptions ||
            ({} as BaseDataGridOptions)
        );

        this.innerResizeTimeouts = [];

    }

    /* *
     *
     *  Functions
     *
     * */

    public onTableChanged(e?: Component.EventTypes | undefined): void {
        // eslint-disable-next-line no-console
        console.log('DataGridComponent.onTableChanged', e);
    }

    /**
     * Get the DataGrid component's options.
     * @returns
     * The JSON of DataGrid component's options.
     *
     * @internal
     *
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

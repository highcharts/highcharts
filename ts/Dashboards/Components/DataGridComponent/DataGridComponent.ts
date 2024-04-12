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
import type DataTable from '../../../Data/DataTable';
import type BaseDataGridOptions from '../../../DataGrid/DataGridOptions';
import type { ColumnOptions } from '../../../DataGrid/DataGridOptions';
import type DataConnectorType from '../../../Data/Connectors/DataConnectorType';
import type MathModifierOptions from '../../../Data/Modifiers/MathModifierOptions';
import type Options from './DataGridComponentOptions';
import type SidebarPopup from '../../EditMode/SidebarPopup';

import Component from '../Component.js';
import DataConnector from '../../../Data/Connectors/DataConnector.js';
import DataGridSyncs from './DataGridSyncs/DataGridSyncs.js';
import DataGridComponentDefaults from './DataGridComponentDefaults.js';
import U from '../../../Core/Utilities.js';
const {
    diffObjects,
    merge
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


        this.on('afterSetConnectors', (e: any): void => {
            const connector = e.connectorHandlers?.[0]?.connector;
            if (connector) {
                this.disableEditingModifiedColumns(connector);
            }
        });

    }

    public onTableChanged(): void {
        if (this.dataGrid && !this.dataGrid?.cellInputEl) {
            this.dataGrid.update({ dataTable: this.filterColumns() });
        }
    }

    /**
     * Disable editing of the columns that are modified by the data modifier.
     * @internal
     *
     * @param connector
     * Attached connector
     */
    private disableEditingModifiedColumns(connector: DataConnectorType): void {
        const options = this.getColumnOptions(connector);
        this.dataGrid?.update({ columns: options });
    }

    /**
     * Get the column options for the data grid.
     * @internal
     */
    private getColumnOptions(connector: DataConnectorType): Record<string, ColumnOptions> {
        const modifierOptions = connector.options.dataModifier;

        if (!modifierOptions || modifierOptions.type !== 'Math') {
            return {};
        }

        const modifierColumns =
            (modifierOptions as MathModifierOptions).columnFormulas;

        if (!modifierColumns) {
            return {};
        }

        const options = {} as Record<string, ColumnOptions>;

        for (let i = 0, iEnd = modifierColumns.length; i < iEnd; ++i) {
            const columnName = modifierColumns[i].column;
            options[columnName] = {
                editable: false
            };
        }

        return options;
    }

    /* *
     *
     *  Class methods
     *
     * */

    /**
     * Triggered on component initialization.
     * @private
     */
    public async load(): Promise<this> {
        this.emit({ type: 'load' });
        await super.load();

        const connector = this.getFirstConnector();

        if (
            connector &&
            !this.connectorListeners.length
        ) {
            const connectorListeners = this.connectorListeners;

            // Reload the store when polling.
            connectorListeners.push(
                connector.on('afterLoad', (e: DataConnector.Event): void => {
                    if (e.table && connector) {
                        connector.table.setColumns(e.table.getColumns());
                    }
                })
            );

            // Update the DataGrid when connector changed.
            connectorListeners.push(
                connector.table.on('afterSetCell', (e: any): void => {
                    const dataGrid = this.dataGrid;
                    let shouldUpdateTheGrid = true;

                    if (dataGrid) {
                        const row = dataGrid.rowElements[e.rowIndex];
                        let cells = [];

                        if (row) {
                            cells = Array.prototype.slice.call(
                                row.childNodes
                            );
                        }

                        cells.forEach((cell: HTMLElement): void => {
                            if (cell.childElementCount > 0) {
                                const input =
                                cell.childNodes[0] as HTMLInputElement,
                                    convertedInputValue =
                                    typeof e.cellValue === 'string' ?
                                        input.value :
                                        +input.value;

                                if (
                                    cell.dataset.columnName ===
                                        e.columnName &&
                                    convertedInputValue === e.cellValue
                                ) {
                                    shouldUpdateTheGrid = false;
                                }
                            }
                        });
                    }

                    shouldUpdateTheGrid ? this.update({}) : void 0;
                })
            );
        }

        this.emit({ type: 'afterLoad' });

        return this;
    }

    /** @private */
    public render(): this {
        super.render();
        if (!this.dataGrid) {
            this.dataGrid = this.constructDataGrid();
        }

        const connector = this.getFirstConnector();

        if (
            connector &&
            this.dataGrid &&
            this.dataGrid.dataTable.modified !== connector.table.modified
        ) {
            this.dataGrid.update({ dataTable: this.filterColumns() });
        }

        this.sync.start();
        this.emit({ type: 'afterRender' });

        this.setupConnectorUpdate();

        return this;
    }

    /** @private */
    public resize(width?: number|null, height?: number|null): void {
        if (this.dataGrid) {
            super.resize(width, height);
        }
    }

    public async update(options: Partial<Options>): Promise<void> {
        const connectorOptions = Array.isArray(options.connector) ?
            options.connector[0] : options.connector;
        if (
            this.connectorHandlers[0] &&
            connectorOptions?.id !== this.connectorHandlers[0]?.connectorId
        ) {
            const connectorListeners = this.connectorListeners;
            for (let i = 0, iEnd = connectorListeners.length; i < iEnd; ++i) {
                connectorListeners[i]();
            }
            connectorListeners.length = 0;
        }
        await super.update(options);
        if (this.dataGrid) {
            this.dataGrid.update(this.options.dataGridOptions || ({} as any));
        }
        this.emit({ type: 'afterUpdate' });
    }

    /** @private */
    private constructDataGrid(): DataGrid {
        if (DataGridComponent.DataGridNamespace) {
            const DataGrid = DataGridComponent.DataGridNamespace.DataGrid;
            const connector = this.getFirstConnector();

            const columnOptions = connector ?
                this.getColumnOptions(
                    connector as DataConnectorType
                ) :
                {};

            this.dataGrid = new DataGrid(
                this.contentElement,
                {
                    ...this.options.dataGridOptions,
                    dataTable:
                        this.options.dataGridOptions?.dataTable ||
                        this.filterColumns(),
                    columns: merge(
                        columnOptions,
                        this.options.dataGridOptions?.columns
                    )
                }
            );
            return this.dataGrid;
        }

        throw new Error('DataGrid not connected.');
    }

    private setupConnectorUpdate(): void {
        const { dataGrid } = this;
        const connector = this.getFirstConnector();

        if (connector && dataGrid) {
            dataGrid.on('cellClick', (e: any): void => {
                if ('input' in e) {
                    e.input.addEventListener(
                        'keyup',
                        (keyEvent: any): void =>
                            this.options.onUpdate(keyEvent, connector)
                    );
                }
            });
        }
    }

    /**
     * Based on the `visibleColumns` option, filter the columns of the table.
     *
     * @internal
     */
    private filterColumns(): DataTable|undefined {
        const table = this.getFirstConnector()?.table.modified,
            visibleColumns = this.options.visibleColumns;

        if (table) {
            // Show all columns if no visibleColumns is provided.
            if (!visibleColumns?.length) {
                return table;
            }

            const columnsToDelete = table
                .getColumnNames()
                .filter((columnName): boolean => (
                    visibleColumns?.length > 0 &&
                    // Don't add columns that are not listed.
                    !visibleColumns.includes(columnName)
                    // Else show the other columns.
                ));

            // On a fresh table clone remove the columns that are not mapped.
            const filteredTable = table.clone();
            filteredTable.deleteColumns(columnsToDelete);

            return filteredTable;
        }
    }

    public getOptionsOnDrop(sidebar: SidebarPopup): Partial<Options> {
        const connectorsIds =
            sidebar.editMode.board.dataPool.getConnectorIds();
        let options: Partial<Options> = {
            cell: '',
            type: 'DataGrid'
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

    /** @private */
    public toJSON(): DataGridComponent.ClassJSON {
        const dataGridOptions = JSON.stringify(this.options.dataGridOptions);
        const base = super.toJSON();

        const json = {
            ...base,
            options: {
                ...base.options,
                dataGridOptions
            }
        };

        this.emit({ type: 'toJSON', json });
        return json;
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
        this.dataGrid?.containerResizeObserver.disconnect();
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

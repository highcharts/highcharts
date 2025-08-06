/* *
 *
 *  (c) 2009-2025 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Dawid Dragula
 *
 * */

import type DataModifier from '../../Data/Modifiers/DataModifier';

import Component from './Component';
import DataTable from '../../Data/DataTable.js';
import Cell from '../Layout/Cell.js';
import Globals from '../Globals.js';

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Data/Connectors/DataConnector' {
    export default interface DataConnector {
        /**
         * Components that are fed by the connector.
         * @internal
         */
        components?: Component[];
    }
}


/* *
 *
 *  Class
 *
 * */

/**
 * A class that handles the connection between the component and the data
 * connector.
 */
class ConnectorHandler {
    /* *
     *
     *  Properties
     *
     * */

    /**
     * Connector options for the component.
     */
    public options: ConnectorHandler.ConnectorOptions;
    /**
     * Connector that allows you to load data via URL or from a local source.
     */
    public connector?: Component.ConnectorTypes;
    /**
     * The id of the connector configuration in the data pool of the dashboard.
     */
    public connectorId?: string;
    /**
     * The component that the connector is tied to.
     */
    public component: Component;
    /**
     * The interval for rendering the component on data changes.
     * @internal
     */
    private tableEventTimeout?: number;
    /**
     * Event listeners tied to the current DataTable. Used for rerendering the
     * component on data changes.
     *
     * @internal
     */
    private tableEvents: Function[] = [];
    /**
     * DataModifier that is applied on top of modifiers set on the DataStore.
     *
     * @internal
     */
    public presentationModifier?: DataModifier;
    /**
     * The table being presented, either a result of the above or a way to
     * modify the table via events.
     *
     * @internal
     */
    public presentationTable?: DataTable;
    /**
     * Helper flag for detecting whether the connector handler has been
     * destroyed, used to check and prevent further operations if the connector
     * handler has been destroyed during asynchronous functions.
     */
    private destroyed?: boolean;


    /* *
     *
     *  Constructor
     *
     * */

    /**
     * Creates an object that manages the data layer for the component.
     *
     * @param component
     * The component that the connector is tied to.
     *
     * @param options
     * The options for the connector.
     *
     */
    constructor(
        component: Component,
        options: ConnectorHandler.ConnectorOptions
    ) {
        this.component = component;
        this.options = options;
    }


    /* *
     *
     *  Functions
     *
     * */

    /**
     * Inits connectors for the component and rerenders it.
     *
     * @returns
     * Promise resolving to the component.
     */
    public async initConnector(): Promise<Component> {
        const component = this.component;
        const connectorId = this.options.id;
        const dataPool = this.component.board.dataPool;

        if (
            connectorId &&
            (
                this.connectorId !== connectorId ||
                dataPool.isNewConnector(connectorId)
            )
        ) {
            if (Cell.isCell(component.cell)) {
                component.cell.setLoadingState();
            }

            const connector = await dataPool.getConnector(connectorId);

            // The connector shouldn't be set if the handler was destroyed
            // during its creation.
            if (!this.destroyed) {
                this.setConnector(connector);
            }
        }

        return component;
    }

    /**
     * Sets the data table settings and events.
     *
     * @param table
     * The data table instance for settings and events.
     */
    public setTable(table: DataTable): void {
        // Set up event listeners
        this.clearTableListeners(table);
        this.setupTableListeners(table);

        // Re-setup if modifier changes
        table.on(
            'setModifier',
            (): void => this.clearTableListeners(table)
        );
        table.on(
            'afterSetModifier',
            (e: DataTable.SetModifierEvent): void => {
                if (e.type === 'afterSetModifier' && e.modified) {
                    this.setupTableListeners(e.modified);
                    this.component.emit({
                        type: 'tableChanged',
                        connector: this.connector
                    });
                }
            }
        );

        if (this.presentationModifier) {
            this.presentationTable =
                this.presentationModifier.modifyTable(
                    table.modified.clone()
                ).modified;
        } else {
            this.presentationTable = table;
        }
    }

    /**
     * Sets the connector for the component connector handler.
     *
     * @param connector
     * The connector to set.
     */
    public setConnector(connector?: Component.ConnectorTypes): Component {
        // Clean up old event listeners
        while (this.tableEvents.length) {
            const eventCallback = this.tableEvents.pop();
            if (typeof eventCallback === 'function') {
                eventCallback();
            }
        }

        this.connector = connector;

        if (connector) {
            const dataTableKey = this.component.dataTableKey;
            const dataTables = connector.dataTables;

            if (dataTableKey) {
                // Match a data table used in this component.
                this.setTable(dataTables[dataTableKey]);

                // Take the first connector data table if id not provided.
            } else {
                this.setTable(Object.values(dataTables)[0]);
            }
        }

        this.addConnectorAssignment();

        return this.component;
    }

    /**
     * Adds event listeners to data table.
     * @param table
     * Data table that is source of data.
     * @internal
     */
    private setupTableListeners(table: DataTable): void {
        const connector = this.connector;

        if (connector) {
            if (table) {
                [
                    'afterDeleteRows',
                    'afterSetCell',
                    'afterSetColumns',
                    'afterSetRows'
                ].forEach((event: any): void => {
                    this.tableEvents.push(
                        table.on(event, (e: any): void => {
                            clearTimeout(this.tableEventTimeout);
                            this.tableEventTimeout = Globals.win.setTimeout(
                                (): void => {
                                    this.component.emit({
                                        ...e,
                                        type: 'tableChanged',
                                        targetConnector: connector
                                    });
                                    this.tableEventTimeout = void 0;
                                });
                        })
                    );
                });
            }
        }
    }

    /**
     * Remove event listeners in data table.
     *
     * @param table
     * The connector data table (data source).
     *
     * @internal
     */
    private clearTableListeners(table: DataTable): void {
        const connector = this.connector;
        const tableEvents = this.tableEvents;

        this.removeTableEvents();

        if (connector) {
            tableEvents.push(table.on(
                'afterSetModifier',
                (e): void => {
                    if (e.type === 'afterSetModifier') {
                        clearTimeout(this.tableEventTimeout);
                        this.tableEventTimeout = Globals.win.setTimeout(
                            (): void => {
                                connector.emit({
                                    ...e,
                                    type: 'tableChanged',
                                    targetConnector: connector
                                });
                                this.tableEventTimeout = void 0;
                            });
                    }
                }
            ));
        }
    }

    /**
     * Adds the component to the provided connector.
     * Starts the connector polling if inactive and one component is provided.
     */
    private addConnectorAssignment(): void {
        const { connector } = this;
        if (!connector) {
            return;
        }

        if (!connector.components) {
            connector.components = [];
        }

        if (!connector.components.includes(this.component)) {
            const options = connector.options;

            // Add the component assignment.
            connector.components.push(this.component);

            // Start the connector polling.
            if (
                'enablePolling' in options &&
                options.enablePolling &&
                !connector.polling &&
                connector.components.length === 1 &&
                'dataRefreshRate' in options
            ) {
                connector.startPolling(
                    Math.max(options.dataRefreshRate || 0, 1) * 1000
                );
            }
        }
    }

    /**
     * Removes the component instance from the provided connector.
     * Stops the connector polling if the last element is removed.
     */
    private removeConnectorAssignment(): void {
        const { connector } = this;
        if (!connector?.components) {
            return;
        }

        const index = connector.components.indexOf(this.component);
        if (index > -1) {
            connector.components.splice(index, 1);

            if (!connector.components.length) {
                connector.stopPolling();
                delete connector.components;
            }
        }
    }

    /**
     * Clears all event listeners in the table.
     */
    private removeTableEvents(): void {
        this.tableEvents.forEach((clearEvent): void => clearEvent());
        this.tableEvents.length = 0;
    }

    /**
     * Updates the options for the connector handler.
     *
     * @param newOptions
     * The new options to update.
     */
    public updateOptions(
        newOptions: ConnectorHandler.ConnectorOptions
    ): void {
        this.options = newOptions;
    }

    /**
     * Destroys the connector handler.
     * @internal
     */
    public destroy(): void {
        this.destroyed = true;
        this.removeConnectorAssignment();
        this.removeTableEvents();
    }
}


/* *
 *
 *  Namespace
 *
 * */

namespace ConnectorHandler {
    /**
     * Contains information to connect the component to a connector in the data
     * pool of the dashboard.
     */
    export interface ConnectorOptions {

        /**
         * Whether to allow the transfer of data changes back to the connector
         * source.
         *
         * @internal
         */
        allowSave?: boolean;

        /**
         * The id of the connector configuration in the data pool of the
         * dashboard.
         */
        id: string;

        /**
         * The modifier to apply to the data table before presenting it. This
         * can be changed to be an open, documented option in the future.
         *
         * @internal
         */
        presentationModifier?: DataModifier;

        /**
         * Reference to the specific connector data table.
         */
        dataTableKey?: string;
    }
}

export default ConnectorHandler;

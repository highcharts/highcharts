/* *
 *
 *  (c) 2009-2024 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Dawid Dragula
 *
 * */

import Component from './Component';
import ComponentGroup from './ComponentGroup.js';
import type DataModifier from '../../Data/Modifiers/DataModifier';
import DataTable from '../../Data/DataTable.js';

import Globals from '../Globals.js';

/* *
 *
 *  Class
 *
 * */

/**
 * A class that handles the connection between the component and the data
 * connector.
 * @internal
 */
class ComponentConnectorHandler {
    /* *
     *
     *  Properties
     *
     * */

    /**
     * Connector options for the component.
     */
    public options: ComponentConnectorHandler.ConnectorOptions;
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
        options: ComponentConnectorHandler.ConnectorOptions
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
            component.cell?.setLoadingState();

            const connector = await dataPool.getConnector(connectorId);
            this.setConnector(connector);
        }

        return component;
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
            // Set up event listeners
            this.clearTableListeners();
            this.setupTableListeners(connector.table);

            // re-setup if modifier changes
            connector.table.on(
                'setModifier',
                (): void => this.clearTableListeners()
            );
            connector.table.on(
                'afterSetModifier',
                (e: DataTable.SetModifierEvent): void => {
                    if (e.type === 'afterSetModifier' && e.modified) {
                        this.setupTableListeners(e.modified);
                    }
                }
            );


            // Add the component to a group based on the
            // connector table id by default
            // TODO: make this configurable
            const tableID = connector.table.id;

            if (!ComponentGroup.getComponentGroup(tableID)) {
                ComponentGroup.addComponentGroup(new ComponentGroup(tableID));
            }
        }

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
                    'afterDeleteColumns',
                    'afterDeleteRows',
                    'afterSetCell',
                    'afterSetConnector',
                    'afterSetColumns',
                    'afterSetRows'
                ].forEach((event: any): void => {
                    this.tableEvents.push((table)
                        .on(event, (e: any): void => {
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
                        }));
                });
            }

            this.tableEvents.push(connector.on('afterLoad', (): void => {
                clearTimeout(this.tableEventTimeout);
                this.tableEventTimeout = Globals.win.setTimeout(
                    (): void => {
                        this.component.emit({
                            target: this.component,
                            type: 'tableChanged',
                            targetConnector: connector
                        });

                        this.tableEventTimeout = void 0;
                    });
            }));
        }
    }

    /**
     * Remove event listeners in data table.
     * @internal
     */
    private clearTableListeners(): void {
        const connector = this.connector;
        const tableEvents = this.tableEvents;

        if (tableEvents.length) {
            tableEvents.forEach(
                (removeEventCallback): void => removeEventCallback()
            );
        }

        if (connector) {
            tableEvents.push(connector.table.on(
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

    public async update(
        newOptions: ComponentConnectorHandler.ConnectorOptions
    ): Promise<void> {
        this.options = newOptions;

        if (this.connectorId !== newOptions.id) {
            const connector =
                await this.component.board.dataPool.getConnector(newOptions.id);

            this.setConnector(connector);
        }
    }

    public destroy(): void {
        // Unregister events (DD) - check the difference between this and
        // clearTableListeners.
        this.tableEvents.forEach((eventCallback): void => eventCallback());
    }
}


/* *
 *
 *  Namespace
 *
 * */

namespace ComponentConnectorHandler {
    /**
     * Contains information to connect the component to a connector in the data
     * pool of the dashboard.
     */
    export interface ConnectorOptions {

        /**
         * Whether to allow the transfer of data changes back to the connector
         * source.
         */
        allowSave?: boolean;

        /**
         * The id of the connector configuration in the data pool of the
         * dashboard.
         */
        id: string;

        /**
         * TODO(DD): Add to documentation, change it to option.
         * @internal
         */
        presentationModifier?: DataModifier;
    }
}

export default ComponentConnectorHandler;

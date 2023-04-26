/* *
 *
 *  (c) 2009-2023 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Sophie Bremer
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type {
    DataPoolOptions,
    DataPoolConnectorOptions
} from './DataPoolOptions.js';
import type DataTable from './DataTable.js';

import DataPoolDefaults from './DataPoolDefaults.js';
import DataConnector from './Connectors/DataConnector.js';

/* *
 *
 *  Class
 *
 * */

/**
 * Data pool to load connectors on-demand.
 *
 * @private
 * @class
 * @name Data.DataPool
 *
 * @param {Data.DataPoolOptions} options
 * Pool options with all connectors.
 */
class DataPool {

    /* *
     *
     *  Constructor
     *
     * */

    public constructor(
        options: (DataPoolOptions|undefined) = DataPoolDefaults
    ) {
        options.connectors = (options.connectors || []);

        this.options = options;
        this.connectors = {};
    }

    /* *
     *
     *  Properties
     *
     * */

    /**
     * Pool options with all connectors.
     *
     * @name Data.DataPool#options
     * @type {Data.DataPoolOptions}
     */
    public readonly options: DataPoolOptions;

    /**
     * Internal dictionary with the connectors and their names.
     * @private
     */
    protected readonly connectors: (
        Record<string, (DataConnector|undefined)>
    );

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Loads the connector.
     *
     * @function Data.DataPool#getConnector
     *
     * @param {string} name
     * Name of the connector.
     *
     * @return {Promise<Data.DataConnector>}
     * Returns the connector.
     */
    public getConnector(
        name: string
    ): Promise<DataConnector> {
        const connector = this.connectors[name];

        if (connector) {
            // already loaded
            return Promise.resolve(connector);
        }

        const connectorOptions = this.getConnectorOptions(name);

        if (connectorOptions) {
            return this.loadConnector(connectorOptions);
        }

        throw new Error(`Connector not found. (${name})`);
    }

    /**
     * Returns the names of all connectors.
     *
     * @private
     *
     * @return {Array<string>}
     * Names of all connectors.
     */
    public getConnectorsNames(): Array<string> {
        const connectors = this.options.connectors,
            connectorsNames: Array<string> = [];

        for (let i = 0, iEnd = connectors.length; i < iEnd; ++i) {
            connectorsNames.push(connectors[i].name);
        }

        return connectorsNames;
    }

    /**
     * Loads the options of the connector.
     *
     * @private
     *
     * @param {string} name
     * Name of the connector.
     *
     * @return {DataPoolConnectorOptions|undefined}
     * Returns the options of the connector, or `undefined` if not found.
     */
    protected getConnectorOptions(
        name: string
    ): (DataPoolConnectorOptions|undefined) {
        const connectors = this.options.connectors;

        for (let i = 0, iEnd = connectors.length; i < iEnd; ++i) {
            if (connectors[i].name === name) {
                return connectors[i];
            }
        }
    }

    /**
     * Loads the connector table.
     *
     * @function Data.DataPool#getConnectorTable
     *
     * @param {string} name
     * Name of the connector.
     *
     * @return {Promise<Data.DataTable>}
     * Returns the connector table.
     */
    public getConnectorTable(
        name: string
    ): Promise<DataTable> {
        return this
            .getConnector(name)
            .then((connector): DataTable => connector.table);
    }

    /**
     * Creates and loads the connector.
     *
     * @private
     *
     * @param {Data.DataPoolConnectorOptions} connectorOptions
     * Options of connector.
     *
     * @return {Promise<Data.DataConnector>}
     * Returns the connector.
     */
    protected loadConnector(
        connectorOptions: DataPoolConnectorOptions
    ): Promise<DataConnector> {
        return new Promise((resolve, reject): void => {
            const ConnectorClass: (Class|undefined) =
                DataConnector.getConnector(connectorOptions.type);

            if (!ConnectorClass) {
                throw new Error(
                    `Connector type not found. (${connectorOptions.type})`
                );
            }

            const connector =
                new ConnectorClass(void 0, connectorOptions.options);

            this.connectors[connectorOptions.name] = connector;

            connector.on('afterLoad', (): void => resolve(connector));
            connector.on('loadError', reject);
            connector.load();
        });
    }

    /**
     * Sets connector options with a specific name.
     *
     * @param {Data.DataPoolConnectorOptions} connectorOptions
     * Connector options to set.
     */
    public setConnectorOptions(
        connectorOptions: DataPoolConnectorOptions
    ): void {
        const connectors = this.options.connectors;

        for (let i = 0, iEnd = connectors.length; i < iEnd; ++i) {
            if (connectors[i].name === connectorOptions.name) {
                connectors.splice(i, 1, connectorOptions);
                return;
            }
        }

        connectors.push(connectorOptions);
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default DataPool;

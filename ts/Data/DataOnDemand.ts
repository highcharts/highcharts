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
    DataOnDemandOptions,
    DataOnDemandStoreOptions
} from './DataOnDemandOptions.js';
import type DataTable from './DataTable.js';

import DataOnDemandDefaults from './DataOnDemandDefaults.js';
import DataStore from './Stores/DataStore.js';

/* *
 *
 *  Class
 *
 * */

/**
 * Data pool to load stores on-demand.
 *
 * @private
 * @class
 * @name Highcharts.DataOnDemand
 *
 * @param {Highcharts.DataOnDemandOptions} options
 * Pool options with all stores.
 */
class DataOnDemand {

    /* *
     *
     *  Constructor
     *
     * */

    public constructor(
        options: (DataOnDemandOptions|undefined) = DataOnDemandDefaults
    ) {
        options.stores = (options.stores || []);

        this.options = options;
        this.stores = {};
    }

    /* *
     *
     *  Properties
     *
     * */

    /**
     * Pool options with all stores.
     *
     * @name Highcharts.DataOnDemand#options
     * @type {Highcharts.DataOnDemandOptions}
     */
    public readonly options: DataOnDemandOptions;

    /**
     * Internal dictionary with the stores and their names.
     * @private
     */
    protected readonly stores: (
        Record<string, (DataStore|undefined)>
    );

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Loads the store.
     *
     * @function Highcharts.DataOnDemand#getStore
     *
     * @param {string} name
     * Name of the store.
     *
     * @return {Promise<Highcharts.DataStore>}
     * Returns the store.
     */
    public getStore(
        name: string
    ): Promise<DataStore> {
        const store = this.stores[name];

        if (store) {
            // already loaded
            return Promise.resolve(store);
        }

        const storeOptions = this.getStoreOptions(name);

        if (storeOptions) {
            return this.loadStore(storeOptions);
        }

        throw new Error(`Store not found. (${name})`);
    }

    /**
     * Loads the options of the store.
     *
     * @private
     *
     * @param {string} name
     * Name of the store.
     *
     * @return {DataOnDemandStoreOptions|undefined}
     * Returns the options of the store, or `undefined` if not found.
     */
    protected getStoreOptions(
        name: string
    ): (DataOnDemandStoreOptions|undefined) {
        const stores = this.options.stores;

        for (let i = 0, iEnd = stores.length; i < iEnd; ++i) {
            if (stores[i].name === name) {
                return stores[i];
            }
        }
    }

    /**
     * Loads the store table.
     *
     * @function Highcharts.DataOnDemand#getStoreTable
     *
     * @param {string} name
     * Name of the store.
     *
     * @return {Promise<Highcharts.DataTable>}
     * Returns the store table.
     */
    public getStoreTable(
        name: string
    ): Promise<DataTable> {
        return this
            .getStore(name)
            .then((store): DataTable => store.table);
    }

    /**
     * Creates and loads the store.
     *
     * @private
     *
     * @param {Highcharts.DataOnDemandStoreOptions} storeOptions
     * Options of store.
     *
     * @return {Promise<Highcharts.DataStore>}
     * Returns the store.
     */
    protected loadStore(
        storeOptions: DataOnDemandStoreOptions
    ): Promise<DataStore> {
        return new Promise((resolve, reject): void => {
            const StoreClass: (Class|undefined) =
                DataStore.getStore(storeOptions.storeType);

            if (!StoreClass) {
                throw new Error(`Store type not found. (${storeOptions.storeType})`);
            }

            const store = new StoreClass(void 0, storeOptions.storeOptions);

            this.stores[storeOptions.name] = store;

            store.on('afterLoad', (): void => resolve(store));
            store.on('loadError', reject);
            store.load();
        });
    }

    /**
     * Sets store options with a specific name.
     *
     * @param {Highcharts.DataOnDemandStoreOptions} storeOptions
     * Store options to set.
     */
    public setStoreOptions(
        storeOptions: DataOnDemandStoreOptions
    ): void {
        const stores = this.options.stores;

        for (let i = 0, iEnd = stores.length; i < iEnd; ++i) {
            if (stores[i].name === storeOptions.name) {
                stores.splice(i, 1, storeOptions);
                return;
            }
        }

        stores.push(storeOptions);
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default DataOnDemand;

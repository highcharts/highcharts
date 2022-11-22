/* *
 *
 *  (c) 2020-2022 Highsoft AS
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
    DataOnDemandSourceOptions
} from './DataOnDemandOptions.js';

import DataStore from './Stores/DataStore.js';

/* *
 *
 *  Class
 *
 * */

/**
 * Data pool to load sources from stores on-demand.
 *
 * @private
 * @class
 * @name Highcharts.DataOnDemand
 *
 * @param {Highcharts.DataOnDemandOptions} options
 * Pool options with all sources.
 */
export class DataOnDemand {

    /* *
     *
     *  Constructor
     *
     * */

    public constructor(
        options: DataOnDemandOptions
    ) {
        this.options = options;
        this.sources = {};
    }

    /* *
     *
     *  Properties
     *
     * */

    /**
     * Pool options with all sources.
     *
     * @name Highcharts.DataOnDemand#options
     * @type {Highcharts.DataOnDemandOptions}
     */
    public readonly options: DataOnDemandOptions;

    /**
     * Internal dictionary with the stores of sources.
     * @private
     */
    protected readonly sources: (
        Record<string, (DataStore<DataStore.Event>|undefined)>
    );

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Loads the options of the source.
     *
     * @private
     *
     * @param {string} name
     * Name of the source.
     *
     * @return {DataOnDemandSourceOptions|undefined}
     * Returns the options of the source, or `undefined` if not found.
     */
    protected getSourceOptions(
        name: string
    ): (DataOnDemandSourceOptions|undefined) {
        const sources = this.options.sources;

        for (let i = 0, iEnd = sources.length; i < iEnd; ++i) {
            if (sources[i].name === name) {
                return sources[i];
            }
        }
    }

    /**
     * Loads the store of the source.
     *
     * @function Highcharts.DataOnDemand#getSource
     *
     * @param {string} name
     * Name of the source.
     *
     * @return {Promise<Highcharts.DataStore>}
     * Returns the store of the source.
     */
    public getSource(
        name: string
    ): Promise<DataStore<DataStore.Event>> {
        const sources = this.sources;
        const source = sources[name];

        if (source) {
            return Promise.resolve(source);
        }

        const sourceOptions = this.getSourceOptions(name);

        if (sourceOptions) {
            return this.loadStore(sourceOptions);
        }

        throw new Error('Source not found');
    }

    /**
     * Creates and loads the store of the source.
     *
     * @private
     *
     * @param {Highcharts.DataOnDemandSourceOptions} sourceOptions
     * Options of source and store.
     *
     * @return {Promise<Highcharts.DataStore>}
     * Returns the store of the source.
     */
    protected loadStore(
        sourceOptions: DataOnDemandSourceOptions
    ): Promise<DataStore<DataStore.Event>> {
        return new Promise((resolve, reject): void => {
            const StoreClass: (Class|undefined) =
                DataStore.getStore(sourceOptions.storeType);

            if (!StoreClass) {
                throw new Error('Store type not found');
            }

            const store = new StoreClass(void 0, sourceOptions.storeOptions);

            this.sources[sourceOptions.name] = store;

            store.on('afterLoad', (): void => resolve(store));
            store.on('loadError', reject);
            store.load();
        });
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default DataOnDemand;

/* *
 *
 *  (c) 2009-2025 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Pawel Lysy
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type DataEvent from '../DataEvent';
import type Types from '../../Shared/Types';
import type JSONConnectorOptions from './JSONConnectorOptions';
import type DataTable from '../DataTable';

import DataConnector from './DataConnector.js';
import U from '../../Core/Utilities.js';
import JSONConverter from '../Converters/JSONConverter.js';
const { merge } = U;

/* *
 *
 *  Class
 *
 * */

/**
 * Class that handles creating a DataConnector from JSON structure
 *
 * @private
 */
class JSONConnector extends DataConnector {
    /* *
     *
     *  Static Properties
     *
     * */

    protected static readonly defaultOptions: JSONConnectorOptions = {
        data: [],
        enablePolling: false,
        dataRefreshRate: 0,
        firstRowAsNames: true,
        orientation: 'rows'
    };

    /* *
     *
     *  Constructor
     *
     * */

    /**
     * Constructs an instance of JSONConnector.
     *
     * @param {JSONConnector.UserOptions} [options]
     * Options for the connector and converter.
     *
     * @param {Array<DataTable>} [dataTables]
     * Multiple connector data tables options.
     */
    public constructor(
        options?: JSONConnector.UserOptions,
        dataTables?: Array<DataTable>
    ) {
        const mergedOptions = merge(JSONConnector.defaultOptions, options);

        super(mergedOptions, dataTables);

        this.options = mergedOptions;

        if (mergedOptions.enablePolling) {
            this.startPolling(
                Math.max(mergedOptions.dataRefreshRate || 0, 1) * 1000
            );
        }
    }

    /* *
     *
     *  Properties
     *
     * */

    /**
     * Options related to the handling of the JSON DataConnector,
     * i.e. source, fetching, polling
     */
    public readonly options: JSONConnectorOptions;

    /**
     * The attached parser that converts the data format to the table.
     */
    public converter?: JSONConverter;

    /* *
     *
     *  Functions
     *
     * */


    /**
     * Iterates over the data tables and initiates the corresponding converters.
     * Assigns the first converter.
     *
     * @param {Array<Array<number|string>>}[data]
     * Data retrieved from the provided URL.
     */
    public initConverters(data: Array<Array<number | string>>): void {
        let index = 0;
        for (const [key, table] of Object.entries(this.dataTables)) {
            const options = this.options;
            // Takes over the connector default options.
            const dataTableOptions = {
                dataTableKey: key,
                columnNames: table.columnNames ?? options.columnNames,
                firstRowAsNames: table.firstRowAsNames ??
                    options.firstRowAsNames,
                orientation: table.orientation ?? options.orientation,
                beforeParse: table.beforeParse ?? options.beforeParse
            };

            const converter = new JSONConverter(
                merge(this.options, dataTableOptions)
            );

            table.deleteColumns();
            converter.parse({ data });
            table.setColumns(converter.getTable().getColumns());

            // Assign the first converter.
            if (index === 0) {
                this.converter = converter;
            }
            index++;
        }
    }

    /**
     * Initiates the loading of the JSON source to the connector
     *
     * @param {DataEvent.Detail} [eventDetail]
     * Custom information for pending events.
     *
     * @emits JSONConnector#load
     * @emits JSONConnector#afterLoad
     */
    public load(eventDetail?: DataEvent.Detail): Promise<this> {
        const connector = this,
            tables = connector.dataTables,
            { data, dataUrl, dataModifier } = connector.options;

        connector.emit<JSONConnector.Event>({
            type: 'load',
            data,
            detail: eventDetail,
            tables
        });

        return Promise
            .resolve(
                dataUrl ?
                    fetch(dataUrl).then(
                        (response): Promise<any> => response.json()
                    )['catch']((error): void => {
                        connector.emit<JSONConnector.Event>({
                            type: 'loadError',
                            detail: eventDetail,
                            error,
                            tables
                        });
                        console.warn(`Unable to fetch data from ${dataUrl}.`); // eslint-disable-line no-console
                    }) :
                    data || []
            )
            .then((data): Promise<Array<Array<number | string>>> => {
                if (data) {
                    this.initConverters(data);
                }
                return connector.setModifierOptions(dataModifier).then((): Array<Array<number|string>> => data);
            })
            .then((data): this => {
                connector.emit<JSONConnector.Event>({
                    type: 'afterLoad',
                    data,
                    detail: eventDetail,
                    tables
                });
                return connector;
            })['catch']((error): never => {
                connector.emit<JSONConnector.Event>({
                    type: 'loadError',
                    detail: eventDetail,
                    error,
                    tables
                });
                throw error;
            });
    }
}

/* *
 *
 *  Class Namespace
 *
 * */

/**
 * Types for class-specific options and events.
 */
namespace JSONConnector {

    /* *
     *
     *  Declarations
     *
     * */

    /**
     * Event objects fired from JSONConnector events.
     */
    export type Event = (ErrorEvent|LoadEvent);

    /**
     * The event object that is provided on errors within JSONConnector.
     */
    export interface ErrorEvent extends DataConnector.ErrorEvent {
        data?: JSONConverter.Data;
    }

    /**
     * The event object that is provided on load events within JSONConnector.
     */
    export interface LoadEvent extends DataConnector.LoadEvent {
        data?: JSONConverter.Data
    }

    /**
     * Available options for constructor of the JSONConnector.
     */
    export type UserOptions = Types.DeepPartial<JSONConnectorOptions>;

}

/* *
 *
 *  Registry
 *
 * */

declare module './DataConnectorType' {
    interface DataConnectorTypes {
        JSON: typeof JSONConnector;
    }
}

DataConnector.registerType('JSON', JSONConnector);

/* *
 *
 *  Default Export
 *
 * */

export default JSONConnector;

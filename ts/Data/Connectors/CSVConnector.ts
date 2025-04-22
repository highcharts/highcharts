/* *
 *
 *  (c) 2009-2025 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Torstein Hønsi
 *  - Christer Vasseng
 *  - Gøran Slettemark
 *  - Sophie Bremer
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type DataEvent from '../DataEvent';
import type CSVConnectorOptions from './CSVConnectorOptions';
import type Types from '../../Shared/Types';
import type DataTable from '../DataTable';
import type { BeforeParseCallbackFunction } from './CSVConnectorOptions';

import CSVConverter from '../Converters/CSVConverter.js';
import DataConnector from './DataConnector.js';
import U from '../../Core/Utilities.js';
const { merge } = U;

/* *
 *
 *  Class
 *
 * */

/**
 * Class that handles creating a DataConnector from CSV
 *
 * @private
 */
class CSVConnector extends DataConnector {

    /* *
     *
     *  Static Properties
     *
     * */

    protected static readonly defaultOptions: CSVConnectorOptions = {
        csv: '',
        csvURL: '',
        enablePolling: false,
        dataRefreshRate: 1,
        firstRowAsNames: true
    };

    /* *
     *
     *  Constructor
     *
     * */

    /**
     * Constructs an instance of CSVConnector.
     *
     * @param {CSVConnector.UserOptions} [options]
     * Options for the connector and converter.
     *
     * @param {Array<DataTable>} [dataTables]
     * Multiple connector data tables options.
     *
     */
    public constructor(
        options?: CSVConnector.UserOptions,
        dataTables?: Array<DataTable>
    ) {
        const mergedOptions = merge(CSVConnector.defaultOptions, options);

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
     * Options related to the handling of the CSV DataConnector,
     * i.e. source, fetching, polling
     */
    public readonly options: CSVConnectorOptions;

    /**
     * The attached parser, which can be replaced in the constructor
     */
    public converter?: CSVConverter;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Iterates over the data tables and initiates the corresponding converters.
     * Assigns the first converter.
     *
     * @param {string}[csv]
     * Data retrieved from the provided URL.
     */
    public initConverters(csv: string): void {
        let index = 0;

        for (const [key, table] of Object.entries(this.dataTables)) {
            const {
                columnNames,
                firstRowAsNames,
                orientation,
                beforeParse
            } = table;
            const dataTableOptions = {
                dataTableKey: key,
                columnNames,
                firstRowAsNames,
                orientation,
                beforeParse: beforeParse as BeforeParseCallbackFunction
            };

            const mergedOptions = merge(dataTableOptions, this.options);
            const converter = new CSVConverter(mergedOptions);

            table.deleteColumns();
            converter.parse({ csv });
            table.setColumns(converter.getTable().getColumns());

            // Assign the first converter.
            if (index === 0) {
                this.converter = converter;
            }

            index++;
        }
    }

    /**
     * Initiates the loading of the CSV source to the connector
     *
     * @param {DataEvent.Detail} [eventDetail]
     * Custom information for pending events.
     *
     * @emits CSVConnector#load
     * @emits CSVConnector#afterLoad
     */
    public load(eventDetail?: DataEvent.Detail): Promise<this> {
        const connector = this,
            tables = connector.dataTables,
            {
                csv,
                csvURL,
                dataModifier
            } = connector.options;

        connector.emit<CSVConnector.Event>({
            type: 'load',
            csv,
            detail: eventDetail,
            tables
        });


        return Promise
            .resolve(
                csvURL ?
                    fetch(csvURL).then(
                        (response): Promise<string> => response.text()
                    ) :
                    csv || ''
            )
            .then((csv): Promise<string> => {
                if (csv) {
                    this.initConverters(csv);
                }

                return connector
                    .setModifierOptions(dataModifier)
                    .then((): string => csv);
            })
            .then((csv): this => {
                connector.emit<CSVConnector.Event>({
                    type: 'afterLoad',
                    csv,
                    detail: eventDetail,
                    tables
                });
                return connector;
            })['catch']((error): never => {
                connector.emit<CSVConnector.Event>({
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
namespace CSVConnector {

    /* *
     *
     *  Declarations
     *
     * */

    /**
     * Event objects fired from CSVConnector events.
     */
    export type Event = (ErrorEvent|LoadEvent);

    /**
     * The event object that is provided on errors within CSVConnector.
     */
    export interface ErrorEvent extends DataConnector.ErrorEvent {
        csv?: string;
    }

    /**
     * The event object that is provided on load events within CSVConnector.
     */
    export interface LoadEvent extends DataConnector.LoadEvent {
        csv?: string;
    }

    /**
     * Available options for constructor and converter of the CSVConnector.
     */
    export type UserOptions = (
        Types.DeepPartial<CSVConnectorOptions>&
        CSVConverter.UserOptions
    );

}

/* *
 *
 *  Registry
 *
 * */

declare module './DataConnectorType' {
    interface DataConnectorTypes {
        CSV: typeof CSVConnector;
    }
}

DataConnector.registerType('CSV', CSVConnector);

/* *
 *
 *  Default Export
 *
 * */

export default CSVConnector;

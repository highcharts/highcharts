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
import type DataTableOptions from '../DataTableOptions';

import CSVConverter from '../Converters/CSVConverter.js';
import DataConnector from './DataConnector.js';
import U from '../../Core/Utilities.js';
const { merge, defined } = U;

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
     * @param {Array<DataTableOptions>} [dataTables]
     * Multiple connector data tables options.
     *
     */
    public constructor(
        options?: CSVConnector.UserOptions,
        dataTables?: Array<DataTableOptions>
    ) {
        const mergedOptions = merge(CSVConnector.defaultOptions, options);

        super(mergedOptions, dataTables);

        this.options = defined(dataTables) ?
            merge(mergedOptions, { dataTables }) : mergedOptions;

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
                dataModifier,
                dataTables
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
                    fetch(csvURL, {
                        signal: connector?.pollingController?.signal
                    }).then(
                        (response): Promise<string> => response.text()
                    ) :
                    csv || ''
            )
            .then((csv): Promise<string> => {
                if (csv) {
                    this.initConverters<string>(
                        csv,
                        (key): CSVConverter => {
                            const options = this.options;
                            const tableOptions = dataTables?.find(
                                (dataTable): boolean => dataTable.key === key
                            );

                            // Takes over the connector default options.
                            const mergedTableOptions = {
                                dataTableKey: key,
                                firstRowAsNames:
                                    tableOptions?.firstRowAsNames ??
                                    options.firstRowAsNames,
                                beforeParse: tableOptions?.beforeParse ??
                                    options.beforeParse
                            };

                            return new CSVConverter(
                                merge(this.options, mergedTableOptions)
                            );
                        },
                        (converter, data): void => {
                            converter.parse({ csv: data });
                        }
                    );
                }

                return connector
                    .setModifierOptions(dataModifier, dataTables)
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
     * Available options for constructor of the CSVConnector.
     */
    export type UserOptions = Types.DeepPartial<CSVConnectorOptions>;

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

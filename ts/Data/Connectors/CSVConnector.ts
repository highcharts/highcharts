/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 *  Authors:
 *  - Torstein Hønsi
 *  - Christer Vasseng
 *  - Gøran Slettemark
 *  - Sophie Bremer
 *  - Kamil Kubik
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
import type DataTable from '../DataTable';

import CSVConverter from '../Converters/CSVConverter.js';
import DataConnector from './DataConnector.js';
import U from '../../Core/Utilities.js';
const { merge, fireEvent } = U;

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
        id: 'csv-connector',
        type: 'CSV',
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
     * @param {Partial<CSVConnectorOptions>} [options]
     * Options for the connector and converter.
     */
    public constructor(options?: Partial<CSVConnectorOptions>) {
        const mergedOptions = merge(CSVConnector.defaultOptions, options);

        super(mergedOptions);
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
     * Overrides the DataConnector method. Emits an event on the connector to
     * all registered callbacks of this event.
     *
     * @param {CSVConnector.Event} e
     * Event object containing additional event information.
     */
    public emit(e: CSVConnector.Event): void {
        fireEvent(this, e.type, e);
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
        const connector = this;
        const options = connector.options;
        const { csv, csvURL, dataTables, decimalPoint } = options;

        connector.emit({
            type: 'load',
            csv
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
                            const tableOptions = dataTables?.find(
                                (dataTable): boolean => dataTable.key === key
                            );

                            // The data table options takes precedence over the
                            // connector options.
                            const {
                                firstRowAsNames = options.firstRowAsNames,
                                beforeParse = options.beforeParse
                            } = tableOptions || {};
                            const converterOptions = {
                                decimalPoint,
                                firstRowAsNames,
                                beforeParse
                            };
                            return new CSVConverter(
                                merge(options, converterOptions));
                        },
                        (converter, data): DataTable.ColumnCollection =>
                            converter.parse({ csv: data })
                    );
                }

                return connector.applyTableModifiers().then((): string => csv);
            })
            .then((csv): this => {
                connector.emit({
                    type: 'afterLoad',
                    detail: eventDetail,
                    csv
                });
                return connector;
            })['catch']((error): never => {
                connector.emit({
                    type: 'loadError',
                    detail: eventDetail,
                    error
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
    export interface Event extends DataConnector.Event {
        readonly csv?: string;
    }
}

/* *
 *
 *  Declarations
 *
 * */

declare module './DataConnectorType' {
    interface DataConnectorTypes {
        CSV: typeof CSVConnector;
    }
}

/* *
 *
 *  Registry
 *
 * */

DataConnector.registerType('CSV', CSVConnector);

/* *
 *
 *  Default Export
 *
 * */

export default CSVConnector;

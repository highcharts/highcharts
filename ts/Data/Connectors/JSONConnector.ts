/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 *  Authors:
 *  - Pawel Lysy
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
import type JSONConnectorOptions from './JSONConnectorOptions';
import type { JSONData } from '../Converters/JSONConverterOptions';
import type DataTable from '../DataTable';

import DataConnector from './DataConnector.js';
import JSONConverter from '../Converters/JSONConverter.js';
import U from '../../Core/Utilities.js';
const { merge, fireEvent } = U;

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
        type: 'JSON',
        id: 'json-connector',
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
     * @param {Partial<JSONConnectorOptions>} [options]
     * Options for the connector and converter.
     */
    public constructor(options?: Partial<JSONConnectorOptions>) {
        const mergedOptions = merge(JSONConnector.defaultOptions, options);

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
     * Overrides the DataConnector method. Emits an event on the connector to
     * all registered callbacks of this event.
     *
     * @param {JSONConnector.Event} e
     * Event object containing additional event information.
     */
    public emit(e: JSONConnector.Event): void {
        fireEvent(this, e.type, e);
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
        const connector = this;
        const options = connector.options;
        const { data, dataUrl, dataTables } = options;

        connector.emit({
            type: 'load',
            detail: eventDetail,
            data
        });

        return Promise
            .resolve(
                dataUrl ?
                    fetch(dataUrl, {
                        signal: connector?.pollingController?.signal
                    }).then(
                        (response): Promise<JSONData> => response.json()
                    )['catch']((error): void => {
                        connector.emit({
                            type: 'loadError',
                            detail: eventDetail,
                            error
                        });
                        console.warn(`Unable to fetch data from ${dataUrl}.`); // eslint-disable-line no-console
                    }) :
                    data || []
            )
            .then(async (data): Promise<JSONData> => {
                if (data) {
                    this.initConverters<JSONData>(
                        data,
                        (key): JSONConverter => {
                            const tableOptions = dataTables?.find(
                                (dataTable): boolean => dataTable.key === key
                            );

                            // The data table options takes precedence over the
                            // connector options.
                            const {
                                columnIds = options.columnIds,
                                firstRowAsNames = options.firstRowAsNames,
                                orientation = options.orientation,
                                beforeParse = options.beforeParse
                            } = tableOptions || {};
                            const converterOptions = {
                                data,
                                columnIds,
                                firstRowAsNames,
                                orientation,
                                beforeParse
                            };
                            return new JSONConverter(converterOptions);
                        },
                        (converter, data): DataTable.ColumnCollection =>
                            converter.parse({ data })
                    );
                }
                return connector.applyTableModifiers().then(
                    (): JSONData => data ?? []
                );
            })
            .then((data): this => {
                connector.emit({
                    type: 'afterLoad',
                    detail: eventDetail,
                    data
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
namespace JSONConnector {

    /* *
     *
     *  Declarations
     *
     * */

    /**
     * Event objects fired from JSONConnector events.
     */
    export interface Event extends DataConnector.Event {
        readonly data?: JSONData;
    }
}

/* *
 *
 *  Declarations
 *
 * */

declare module './DataConnectorType' {
    interface DataConnectorTypes {
        JSON: typeof JSONConnector;
    }
}

/* *
 *
 *  Registry
 *
 * */

DataConnector.registerType('JSON', JSONConnector);

/* *
 *
 *  Default Export
 *
 * */

export default JSONConnector;

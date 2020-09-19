/* *
 *
 *  Data Layer
 *
 *  (c) 2012-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type DataCredentialProvider from './CredentialProviders/DataCredentialProvider';
import type DataEventEmitter from '../DataEventEmitter';
import DataJSON from '../DataJSON.js';
import H from '../../Core/Globals.js';
const {
    win
} = H;
import U from '../../Core/Utilities.js';
const {
    addEvent,
    fireEvent,
    merge
} = U;

/* *
 *
 *  Class
 *
 * */

class DataFetch implements DataEventEmitter<DataFetch.EventObject>, DataJSON.Class {

    /* *
     *
     *  Static Properties
     *
     * */

    public static readonly defaultOptions: DataFetch.Options = {
        method: 'GET',
        timeout: 60000
    };

    /* *
     *
     *  Static Functions
     *
     * */

    public static fromJSON(json: DataFetch.ClassJSON): DataFetch {
        return new DataFetch(json.options);
    }

    /* *
     *
     *  Constructor
     *
     * */

    public constructor(options: DeepPartial<DataFetch.Options> = {}) {
        this.options = merge(DataFetch.defaultOptions, options);
    }

    /* *
     *
     *  Properties
     *
     * */

    public options: DataFetch.Options;

    /* *
     *
     *  Functions
     *
     * */

    public abort(
        xhr: XMLHttpRequest,
        eventDetail?: DataEventEmitter.EventDetail
    ): void {
        this.emit({ type: 'abortFetch', detail: eventDetail, xhr });
        xhr.abort();
        this.emit({ type: 'afterAbortFetch', detail: eventDetail, xhr });
    }

    public emit(e: DataFetch.EventObject): void {
        fireEvent(this, e.type, e);
    }

    public error(
        xhr: XMLHttpRequest,
        eventDetail?: DataEventEmitter.EventDetail
    ): void {
        this.emit({ type: 'error', detail: eventDetail, xhr });
    }

    public fetch(
        resource: (string|Request),
        options?: DeepPartial<DataFetch.Options>,
        eventDetail?: DataEventEmitter.EventDetail
    ): void {
        const xhr = new XMLHttpRequest();

        xhr.addEventListener('abort', this.abort.bind(this, xhr, eventDetail));
        xhr.addEventListener('error', this.error.bind(this, xhr, eventDetail));
        xhr.addEventListener('load', this.loaded.bind(this, xhr, eventDetail));
        xhr.addEventListener('timeout', this.timeout.bind(this, xhr, eventDetail));

        let timeout: number;

        if (typeof resource === 'object') {
            options = merge(options, resource);
        }

        options = merge(this.options, options);

        this.emit({ type: 'fetch', detail: eventDetail, xhr });

        if (
            options.timeout &&
            options.timeout > 0
        ) {
            timeout = win.setTimeout(this.timeout.bind(this), 1000, xhr, eventDetail);
        }

        xhr.send(options.body);
    }

    public loaded(
        xhr: XMLHttpRequest,
        eventDetail?: DataEventEmitter.EventDetail
    ): void {
        this.emit({ type: 'afterFetch', detail: eventDetail, xhr });
    }

    public on(
        type: DataFetch.EventObject['type'],
        callback: DataEventEmitter.EventCallback<this, DataFetch.EventObject>
    ): Function {
        return addEvent(this, type, callback);
    }

    private timeout(
        xhr: XMLHttpRequest,
        eventDetail?: DataEventEmitter.EventDetail
    ): void {
        this.emit({ type: 'abortFetch', detail: eventDetail, xhr });
    }

    public toJSON(): DataFetch.ClassJSON {
        return {
            $class: 'DataFetch',
            options: this.options
        };
    }

}

/* *
 *
 *  Namespace
 *
 * */

namespace DataFetch {

    export interface ClassJSON extends DataJSON.ClassJSON {
        options: Options;
    }

    export interface EventObject extends DataEventEmitter.EventObject {
        type: (
            'abortFetch'|'afterAbortFetch'|
            'error'|
            'fetch'|'afterFetch'|
            'timeout'
        );
        xhr?: XMLHttpRequest;
    }

    export interface Options extends DataJSON.JSONObject {
        body?: string;
        cache?: RequestCache;
        credentials?: (RequestCredentials|DataCredentialProvider.ClassJSON);
        context?: string;
        headers?: Record<string, string>;
        integrity?: string;
        method: string;
        mode?: RequestMode;
        redirect?: RequestRedirect;
        referrer?: string;
        referrerPolicy?: ReferrerPolicy;
        signal?: undefined; // @todo support
        timeout?: number;
    }

}

/* *
 *
 *  Registry
 *
 * */

DataJSON.addClass(DataFetch);

/* *
 *
 *  Export
 *
 **/

export default DataFetch;

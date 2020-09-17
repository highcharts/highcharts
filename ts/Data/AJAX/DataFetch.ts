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
        method: 'GET'
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

    public emit(e: DataFetch.EventObject): void {
        fireEvent(this, e.type, e);
    }

    public fetch(uri: string, options?: DeepPartial<DataFetch.Options>): void {
        options = merge(this.options, options);
    }

    public on(
        type: DataFetch.EventObject['type'],
        callback: DataEventEmitter.EventCallback<this, DataFetch.EventObject>
    ): Function {
        return addEvent(this, type, callback);
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
        type: ('');
    }

    export interface Options extends DataJSON.JSONObject, RequestInit {
        body?: string;
        cache?: RequestCache;
        headers?: Record<string, string>;
        integrity?: string;
        method: string;
        mode?: RequestMode;
        redirect?: RequestRedirect;
        referrer?: string;
        referrerPolicy?: ReferrerPolicy;
        signal?: undefined; // @todo support
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

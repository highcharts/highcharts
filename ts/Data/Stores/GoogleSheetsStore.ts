/* *
 *
 *  (c) 2012-2021 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Torstein Hønsi
 *  - Gøran Slettemark
 *  - Wojciech Chmiel
 *  - Sophie Bremer
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type JSON from '../../Core/JSON';

import DataPromise from '../DataPromise.js';
import DataStore from './DataStore.js';
import DataTable from '../DataTable.js';
import GoogleSheetsParser from '../Parsers/GoogleSheetsParser.js';
import HU from '../../Core/HttpUtilities.js';
const { ajax } = HU;
import U from '../../Core/Utilities.js';
const { merge } = U;

/* *
 *
 *  Class
 *
 * *7

/* eslint-disable no-invalid-this, require-jsdoc, valid-jsdoc */

/**
 * @private
 */
class GoogleSheetsStore extends DataStore {

    /* *
     *
     *  Static Properties
     *
     * */

    protected static readonly defaultOptions: GoogleSheetsStore.Options = {
        googleSpreadsheetKey: '',
        worksheet: 1,
        enablePolling: false,
        dataRefreshRate: 2,
        firstRowAsNames: true
    };

    /* *
     *
     *  Constructor
     *
     * */

    /**
     * Constructs an instance of GoogleSheetsStore
     *
     * @param {DataTable} table
     * Optional table to create the store from.
     *
     * @param {CSVStore.OptionsType} options
     * Options for the store and parser.
     *
     * @param {DataParser} parser
     * Optional parser to replace the default parser
     */
    public constructor(
        table: DataTable,
        options: (
            Partial<GoogleSheetsStore.Options>&
            { googleSpreadsheetKey: string }
        ),
        parser?: GoogleSheetsParser
    ) {
        super(table);
        this.options = merge(GoogleSheetsStore.defaultOptions, options);
        this.parser = parser || new GoogleSheetsParser({
            firstRowAsNames: this.options.firstRowAsNames
        });
    }

    /* *
     *
     *  Properties
     *
     * */

    public readonly options: GoogleSheetsStore.Options;

    /**
     * The attached parser, which can be replaced in the constructor
     */
    public readonly parser: GoogleSheetsParser;

    /* *
     *
     *  Functions
     *
     * */

    private fetchSheet(): DataPromise<this> {
        const store = this,
            {
                enablePolling,
                dataRefreshRate,
                googleSpreadsheetKey,
                worksheet
            } = store.options,
            url = [
                'https://spreadsheets.google.com/feeds/cells',
                googleSpreadsheetKey,
                worksheet,
                'public/values?alt=json'
            ].join('/');

        // If already loaded, clear the current table
        store.table.deleteColumns();

        return new DataPromise((resolve, reject): void => {
            ajax({
                url: url,
                dataType: 'json',
                success: (json): void => {
                    store.parser.parse(json);
                    store.table.setColumns(
                        store.parser.getTable().getColumns()
                    );

                    // Polling
                    if (enablePolling) {
                        setTimeout(
                            function (): void {
                                store.fetchSheet();
                            },
                            dataRefreshRate * 1000
                        );
                    }

                    resolve(store);
                },
                error: (
                    xhr: XMLHttpRequest,
                    error: (string|Error)
                ): void => {
                    /* *
                    * TODO:
                    * handle error
                    * ...
                    *
                    * */
                    // console.error(error);
                    reject(error);
                }
            });
        });
    }

    public load(): DataPromise<this> {
        if (this.options.googleSpreadsheetKey) {
            return this.fetchSheet();
        }

        return DataPromise.reject(new Error('Google Spreadsheet Key missing.'));
    }

    /* *
     * TODO:
     * public save() {}
     * ...
     *
     * requires oAuth2 auth
     *
     * */

    public save(): DataPromise<this> {
        return DataPromise.reject(new Error('Not implemented'));
    }


}

/* *
 *
 *  Class Namespace
 *
 * */

namespace GoogleSheetsStore {

    export interface Options extends JSON.Object {
        googleSpreadsheetKey: string;
        worksheet?: number;
        enablePolling: boolean;
        dataRefreshRate: number;
        firstRowAsNames: boolean;
    }

}

/* *
 *
 *  Registry
 *
 * */

declare module './StoreType' {
    interface StoreTypeRegistry {
        Google: typeof GoogleSheetsStore;
    }
}

DataStore.addStore(GoogleSheetsStore);

/* *
 *
 *  Export
 *
 * */

export default GoogleSheetsStore;

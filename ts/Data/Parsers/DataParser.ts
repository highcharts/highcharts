/* *
 *
 *  Data module
 *
 *  (c) 2012-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type DataTable from '../DataTable.js';

class DataParser {

}

namespace DataParser {
    export interface DataParserOptions {

    }
    export interface DataParser {
        parse(options: DataParserOptions): void;
        getTable(): DataTable;
    }
}

export default DataParser;

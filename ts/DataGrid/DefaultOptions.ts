/* *
 *
 *  Data Grid default options
 *
 *  (c) 2009-2024 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Dawid Dragula
 *  - Sebastian Bochan
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type Options from './Options';

import Globals from './Globals.js';

/* *
 *
 *  API Options
 *
 * */

const DefaultOptions: Globals.DeepPartial<Options> = {
    accessibility: {
        enabled: true,
        cellEditing: {
            beforeEdit: 'The cell can be edited, by pressing Enter.',
            afterEdit: 'The cell value has been updated.',
            cancelEdit: 'The cell editing has been cancelled.'
        }// ,
        // sorting: {
        //     ascending: 'Sort in ascending order',
        //     descending: 'Sort in descending order'
        //     none: 'No sort applied'
        // }
    },
    rendering: {
        columns: {
            distribution: 'full'
        },
        rows: {
            bufferSize: 10,
            strictHeights: false
        },
        header: {
            enabled: true
        }
    },
    credits: {
        enabled: true,
        text: 'Highcharts.com',
        href: 'https://www.highcharts.com?credits',
        position: 'bottom'
    },
    columnDefaults: {
        sorting: {
            sortable: true
        },
        resizing: true
    }
};

/* *
 *
 *  Default Export
 *
 * */

export default DefaultOptions;

/* *
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type {
    SeriesTypePlotOptions
} from '../../Core/Series/SeriesType';

/* *
 *
 *  Constants
 *
 * */

/**
 * Common options
 * @private
 */
const common = {
    // enabled: null, // (true for stock charts, false for basic),
    // forced: undefined,
    groupPixelWidth: 2,
    // the first one is the point or start value, the second is the start
    // value if we're dealing with range, the third one is the end value if
    // dealing with a range
    dateTimeLabelFormats: {
        millisecond: [
            '%A, %e %b, %H:%M:%S.%L',
            '%A, %e %b, %H:%M:%S.%L',
            '-%H:%M:%S.%L'
        ],
        second: [
            '%A, %e %b, %H:%M:%S',
            '%A, %e %b, %H:%M:%S',
            '-%H:%M:%S'
        ],
        minute: [
            '%A, %e %b, %H:%M',
            '%A, %e %b, %H:%M',
            '-%H:%M'
        ],
        hour: [
            '%A, %e %b, %H:%M',
            '%A, %e %b, %H:%M',
            '-%H:%M'
        ],
        day: [
            '%A, %e %b %Y',
            '%A, %e %b',
            '-%A, %e %b %Y'
        ],
        week: [
            'Week from %A, %e %b %Y',
            '%A, %e %b',
            '-%A, %e %b %Y'
        ],
        month: [
            '%B %Y',
            '%B',
            '-%B %Y'
        ],
        year: [
            '%Y',
            '%Y',
            '-%Y'
        ]
    }
    // smoothed = false, // enable this for navigator series only
};

/**
 * Extends common options
 * @private
 */
const seriesSpecific = {
    line: {},
    spline: {},
    area: {},
    areaspline: {},
    arearange: {},
    column: {
        groupPixelWidth: 10
    },
    columnrange: {
        groupPixelWidth: 10
    },
    candlestick: {
        groupPixelWidth: 10
    },
    ohlc: {
        groupPixelWidth: 5
    },
    hlc: {
        groupPixelWidth: 5
    // Move to HeikinAshiSeries.ts aftre refactoring data grouping.
    },
    heikinashi: {
        groupPixelWidth: 10
    }
} as SeriesTypePlotOptions;

/**
 * Units are defined in a separate array to allow complete overriding in
 * case of a user option.
 * @private
 */
const units = [
    [
        'millisecond', // unit name
        [1, 2, 5, 10, 20, 25, 50, 100, 200, 500] // allowed multiples
    ], [
        'second',
        [1, 2, 5, 10, 15, 30]
    ], [
        'minute',
        [1, 2, 5, 10, 15, 30]
    ], [
        'hour',
        [1, 2, 3, 4, 6, 8, 12]
    ], [
        'day',
        [1]
    ], [
        'week',
        [1]
    ], [
        'month',
        [1, 3, 6]
    ], [
        'year',
        null
    ]
];

/* *
 *
 *  Default Export
 *
 * */

const DataGroupingDefaults = {
    common,
    seriesSpecific,
    units
};

export default DataGroupingDefaults;

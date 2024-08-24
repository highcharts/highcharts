/* *
 *
 *  (c) 2010-2024 Torstein Honsi
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
import type Time from '../../Core/Time';

/* *
 *
 *  Constants
 *
 * */

/**
 * Common options
 * @private
 */

// The first one is the point or start value, the second is the start value if
// we're dealing with range, the third one is the end value if dealing with a
// range
const dateTimeLabelFormats: Record<string, Array<Time.DateTimeFormat>> = {
    millisecond: [
        // '%A, %e %b, %H:%M:%S.%L',
        {
            weekday: 'long',
            day: 'numeric',
            month: 'short',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            fractionalSecondDigits: 3
        },
        // '%A, %e %b, %H:%M:%S.%L',
        {
            weekday: 'long',
            day: 'numeric',
            month: 'short',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            fractionalSecondDigits: 3
        },
        // '-%H:%M:%S.%L'
        {
            prefix: '-',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            fractionalSecondDigits: 3
        }
    ],
    second: [
        // '%A, %e %b, %H:%M:%S',
        {
            weekday: 'long',
            day: 'numeric',
            month: 'short',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        },
        // '%A, %e %b, %H:%M:%S',
        {
            weekday: 'long',
            day: 'numeric',
            month: 'short',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        },
        // '-%H:%M:%S'
        {
            prefix: '-',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        }
    ],
    minute: [
        // '%A, %e %b, %H:%M',
        {
            weekday: 'long',
            day: 'numeric',
            month: 'short',
            hour: 'numeric',
            minute: 'numeric'
        },
        // '%A, %e %b, %H:%M',
        {
            weekday: 'long',
            day: 'numeric',
            month: 'short',
            hour: 'numeric',
            minute: 'numeric'
        },
        // '-%H:%M'
        {
            prefix: '-',
            hour: 'numeric',
            minute: 'numeric'
        }
    ],
    hour: [
        // '%A, %e %b, %H:%M',
        {
            weekday: 'long',
            day: 'numeric',
            month: 'short',
            hour: 'numeric',
            minute: 'numeric'
        },
        // '%A, %e %b, %H:%M',
        {
            weekday: 'long',
            day: 'numeric',
            month: 'short',
            hour: 'numeric',
            minute: 'numeric'
        },
        // '-%H:%M'
        {
            prefix: '-',
            hour: 'numeric',
            minute: 'numeric'
        }
    ],
    day: [
        // '%A, %e %b %Y',
        {
            weekday: 'long',
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        },
        // '%A, %e %b',
        {
            weekday: 'long',
            day: 'numeric',
            month: 'short'
        },
        // '-%A, %e %b %Y'
        {
            prefix: '-',
            weekday: 'long',
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        }
    ],
    week: [
        // 'Week from %A, %e %b %Y',
        {
            prefix: 'week from ',
            weekday: 'long',
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        },
        // '%A, %e %b',
        {
            weekday: 'long',
            day: 'numeric',
            month: 'short'
        },
        // '-%A, %e %b %Y'
        {
            prefix: '-',
            weekday: 'long',
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        }
    ],
    month: [
        // '%B %Y',
        {
            month: 'long',
            year: 'numeric'
        },
        // '%B',
        {
            month: 'long'
        },
        // '-%B %Y'
        {
            prefix: '-',
            month: 'long',
            year: 'numeric'
        }
    ],
    year: [
        '%Y',
        '%Y',
        '-%Y'
    ]
};

const common = {
    /// enabled: null, // (true for stock charts, false for basic),
    // forced: undefined,
    groupPixelWidth: 2,
    dateTimeLabelFormats
    /// smoothed = false, // enable this for navigator series only
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
    // Move to HeikinAshiSeries.ts after refactoring data grouping.
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
        'millisecond', // Unit name
        [1, 2, 5, 10, 20, 25, 50, 100, 200, 500] // Allowed multiples
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

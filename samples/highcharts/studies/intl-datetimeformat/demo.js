/*
 * Study of the use of Intl.DateTimeFormat in Highcharts. The idea is to replace
 * all date format strings with optionsal objects that can be passed directly to
 * the Intl.DateTimeFormat constructor.
 *
 * This is a work in progress and not yet fully implemented. See internal spec
 * document for discussion.
 *
 * @todo, amnong other things
 * - Fix the `preferredInputType` function in `rangeSelector` to handle
 *   Intl.DateTimeFormat
 * - Defaults for the data grouping `dateTimeLabelFormats`
 * - Consistent cache for Intl.DateTimeFormat instances
 * - Smarter object-to-key in Tooltip
 * - API to set definitions and refer to them in templating by a key character
 */

Highcharts.setOptions({
    time: {
        // locale: 'en-US'
    },

    rangeSelector: {
        inputDateFormat: {
            dateStyle: 'long'
        }
    },

    plotOptions: {
        series: {
            dataGrouping: {
                dateTimeLabelFormats: {
                    day: [{
                        dateStyle: 'full'
                    }]
                }
            }
        }
    },

    xAxis: {
        dateTimeLabelFormats: {
            millisecond: {
                main: {
                    hour: 'numeric',
                    minute: 'numeric',
                    second: 'numeric',
                    fractionalSecondDigits: 3
                }
            },
            second: {
                main: {
                    hour: 'numeric',
                    minute: 'numeric',
                    second: 'numeric'
                }
            },
            minute: {
                main: {
                    hour: 'numeric',
                    minute: 'numeric'
                }
            },
            day: {
                main: {
                    month: 'short',
                    day: 'numeric'
                }
            },
            week: {
                main: {
                    month: 'short',
                    day: 'numeric'
                }
            },
            month: {
                main: {
                    month: 'short',
                    year: '2-digit'
                }
            },
            year: {
                main: {
                    year: 'numeric'
                }
            }
        }
    }
});

// Legacy options
/*
Highcharts.setOptions({
    tooltip: {
        dateTimeLabelFormats: {
            millisecond: '%A, %e %b, %H:%M:%S.%L',
            second: '%A, %e %b, %H:%M:%S',
            minute: '%A, %e %b, %H:%M',
            hour: '%A, %e %b, %H:%M',
            day: '%A, %e %b %Y',
            week: 'Week from %A, %e %b %Y',
            month: '%B %Y',
            year: '%Y'
        }
    }
});
// */

(async () => {

    const data = await fetch(
        'https://demo-live-data.highcharts.com/aapl-c.json'
    ).then(response => response.json());

    // Create the chart
    Highcharts.stockChart('container', {
        rangeSelector: {
            selected: 1
        },

        title: {
            text: 'AAPL Stock Price'
        },

        xAxis: {
            type: 'datetime'
        },

        series: [{
            name: 'AAPL',
            data,
            tooltip: {
                valueDecimals: 2
            }
        }]
    });
})();
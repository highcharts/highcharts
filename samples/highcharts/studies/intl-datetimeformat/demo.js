/*
 * Study of the use of Intl.DateTimeFormat in Highcharts. The idea is to replace
 * all date format strings with optionsal objects that can be passed directly to
 * the Intl.DateTimeFormat constructor.
 *
 * This is a work in progress and not yet fully implemented. See internal spec
 * document for discussion.
 *
 * @todo, amnong other things
 * - Defaults for the data grouping `dateTimeLabelFormats`
 * - Consistent cache for Intl.DateTimeFormat instances
 * - Smarter object-to-key in Tooltip
 * - API to set definitions and refer to them in templating by a key character
 */

Highcharts.setOptions({
    time: {
        // locale: 'en-GB'
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
    }
});

// Legacy options
/*
Highcharts.setOptions({
    rangeSelector: {
        inputDateFormat: '%e %b %Y'
    },

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
    },
    xAxis: {
        dateTimeLabelFormats: {
            millisecond: {
                main: '%H:%M:%S.%L'
            },
            second: {
                main: '%H:%M:%S'
            },
            minute: {
                main: '%H:%M'
            },
            hour: {
                main: '%H:%M'
            }
            day: {
                main: '%e %b'
            },
            week: {
                main: '%e %b'
            },
            month: {
                main: '%b \'%y'
            },
            year: {
                main: '%Y'
            }
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
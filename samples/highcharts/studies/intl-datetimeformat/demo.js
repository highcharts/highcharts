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

    tooltip: {
        dateTimeLabelFormats: {
            millisecond: {
                weekday: 'long',
                month: 'short',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                fractionalSecondDigits: 3
            },
            second: {
                weekday: 'long',
                month: 'short',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric'
            },
            minute: {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric'
            },
            hour: {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
                hour: 'numeric'
            },
            day: {
                weekday: 'long',
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            },
            week: {
                weekday: 'long',
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            },
            month: {
                month: 'long',
                year: 'numeric'
            },
            year: {
                year: 'numeric'
            }
        }
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
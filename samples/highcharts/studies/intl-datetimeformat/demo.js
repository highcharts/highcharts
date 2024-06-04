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
 * - API to set definitions and refer to them in templating by a key character
 */

(({ addEvent, Time, wrap }) => {
    // Look for an object that is not { main, from, to }
    const isIntlFormat = f => (
        typeof f === 'object' &&
        Object.keys(f).some(key => !['main', 'from', 'to'].includes(key))
    );

    wrap(
        Time.prototype,
        'dateFormat',
        function (proceed, format, timestamp, capitalize) {
            if (typeof format === 'object') {
                const dateTimeFormat = Intl.DateTimeFormat(
                    this.options.locale,
                    format
                );
                return dateTimeFormat.format(timestamp);
            }

            return proceed(format, timestamp, capitalize);
        }
    );

    wrap(
        Time.prototype,
        'resolveDTLFormat',
        function (proceed, f) {
            f = proceed(f);

            if (isIntlFormat(f)) {
                f.main = f;
            }

            return f;
        }
    );

    // Pre-compile the date formats for tooltips
    addEvent(Highcharts.Series, 'afterSetOptions', function () {
        const dateTimeLabelFormats = this.tooltipOptions.dateTimeLabelFormats;

        Object.keys(dateTimeLabelFormats).forEach((key, i) => {
            const format = dateTimeLabelFormats[key];
            if (isIntlFormat(format)) {
                Highcharts.dateFormats[i] = function (timestamp) {
                    return Intl.DateTimeFormat(this.options.locale, format)
                        .format(timestamp);
                };

                dateTimeLabelFormats[key] = `%${i}`;
            }
        });
    });
})(Highcharts);


Highcharts.setOptions({
    time: {
        // locale: 'en-GB'
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
        // @todo: fix the preferredInputType function
        _inputDateFormat: {
            dateStyle: 'long'
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

        series: [{
            name: 'AAPL',
            data: data,
            tooltip: {
                valueDecimals: 2
            }
        }]
    });
})();
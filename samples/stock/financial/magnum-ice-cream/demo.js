(async () => {

    const labelStyle = {
        color: 'var(--mstar-text-muted)',
        fontSize: '11px',
        fontWeight: '300'
    };
    const smallLabelStyle = {
        color: 'var(--mstar-text-muted)',
        fontSize: '10px',
        fontWeight: '300'
    };
    const bodyTextStyle = {
        color: 'var(--mstar-text-strong)',
        fontSize: '12px',
        fontWeight: '300'
    };

    const json = await fetch(
        'https://cdn.jsdelivr.net/gh/highcharts/highcharts@a38d619238/samples/data/morningstar/magnum-ice-cream-company-ohlcv.json'
    ).then(r => r.json());

    const rawData = json.ts.results[0].data,
        dataTable = new Highcharts.DataTable();

    // The data is sorted from newest to oldest, with values as strings
    for (let i = rawData.length - 1; i >= 0; i--) {
        const entry = rawData[i],
            parts = entry['Date Received (GMT)'].split('-');

        dataTable.setRow({
            Date: `${parts[2]}-${parts[1]}-${parts[0]}`,
            Open: +entry['Open price'],
            High: +entry['High price'],
            Low: +entry['Low price'],
            Close: +entry['Last price'],
            Volume: +entry['Cumulative volume']
        });
    }

    Highcharts.stockChart('container', {

        dataTable,

        chart: {
            spacing: 16,
            style: {
                fontFamily: '"MorningstarIntrinsic", "Helvetica Neue", ' +
                    'Helvetica, Arial, sans-serif'
            }
        },

        title: {
            align: 'left',
            style: {
                color: 'var(--mstar-text-strong)',
                fontSize: '16px',
                fontWeight: '500'
            },
            text: 'MICC is climbing back from late-April lows after a ' +
                'February shock'
        },

        subtitle: {
            align: 'left',
            style: {
                color: 'var(--mstar-text-muted)',
                fontSize: '12px',
                fontWeight: '300'
            },
            text: 'OHLC and volume, Jan - May 2026 · Source: Morningstar'
        },

        caption: {
            style: labelStyle,
            text: 'The Magnum Ice Cream Company peaked near €20 in early ' +
                'February before a -18% drop on Feb 12 set off a ' +
                'months-long drawdown. Late-April lows of €13 have since ' +
                'given way to a recovery rally.'
        },

        accessibility: {
            keyboardNavigation: {
                focusBorder: {
                    style: {
                        color: 'var(--mstar-accent)'
                    }
                }
            }
        },

        rangeSelector: {
            buttonTheme: {
                fill: 'none',
                r: 4,
                states: {
                    hover: {
                        fill: 'var(--mstar-hover)',
                        style: { color: 'var(--mstar-text-strong)' }
                    },
                    select: {
                        fill: 'var(--mstar-accent-select)',
                        style: {
                            color: 'var(--mstar-accent)',
                            fontWeight: '500'
                        }
                    }
                },
                stroke: 'none',
                'stroke-width': 0,
                style: {
                    color: 'var(--mstar-text-muted)',
                    fontWeight: '300'
                }
            },
            buttons: [{
                count: 1,
                text: '1m',
                title: 'View 1 month',
                type: 'month'
            }, {
                count: 3,
                text: '3m',
                title: 'View 3 months',
                type: 'month'
            }, {
                text: 'YTD',
                title: 'View year to date',
                type: 'ytd'
            }, {
                text: 'All',
                title: 'View all',
                type: 'all'
            }],
            inputStyle: {
                color: 'var(--mstar-text-strong)',
                fontWeight: '300'
            },
            labelStyle: { color: 'var(--mstar-text-muted)' },
            selected: 1
        },

        navigator: {
            handles: {
                backgroundColor: 'var(--mstar-surface)',
                borderColor: 'var(--mstar-line)'
            },
            maskFill: 'var(--mstar-mask)',
            outlineColor: 'var(--mstar-line)',
            series: {
                type: 'areaspline',
                color: 'var(--mstar-accent)',
                dataMapping: { y: 'Close' },
                fillColor: 'var(--mstar-accent-soft)',
                lineWidth: 1
            },
            xAxis: { gridLineColor: 'var(--mstar-line)' }
        },

        scrollbar: { enabled: false },

        tooltip: {
            backgroundColor: 'var(--mstar-surface)',
            borderColor: 'var(--mstar-line)',
            borderRadius: 4,
            borderWidth: 1,
            shadow: false,
            style: bodyTextStyle,
            valueDecimals: 2
        },

        xAxis: {
            accessibility: {
                description: 'Trading session dates',
                rangeDescription: 'From January 2 through May 7, 2026'
            },
            labels: {
                style: labelStyle
            },
            lineColor: 'var(--mstar-line)',
            tickColor: 'var(--mstar-line)'
        },

        yAxis: [{
            accessibility: {
                description: 'Daily OHLC price in euros',
                rangeDescription: 'Approximately €13 to €20'
            },
            gridLineColor: 'var(--mstar-line)',
            height: '100%',
            labels: {
                align: 'left',
                style: labelStyle,
                x: 8
            },
            title: {
                style: labelStyle,
                text: 'Price (€)'
            }
        }, {
            accessibility: {
                description: 'Cumulative daily trading volume',
                rangeDescription: 'Up to approximately 230,000 shares per ' +
                    'session'
            },
            gridLineWidth: 0,
            height: '25%',
            labels: {
                align: 'left',
                reserveSpace: false,
                style: smallLabelStyle,
                x: 4,
                y: -2
            },
            offset: 0,
            opposite: false,
            title: { text: undefined },
            top: '75%'
        }],

        plotOptions: {
            candlestick: {
                color: 'var(--mstar-negative)',
                lineColor: 'var(--mstar-negative)',
                upColor: 'var(--mstar-positive)',
                upLineColor: 'var(--mstar-positive)'
            },
            column: {
                borderWidth: 0,
                color: 'var(--mstar-accent-soft)'
            },
            series: {
                dataGrouping: { enabled: true },
                dataMapping: { x: 'Date' }
            }
        },

        series: [{
            accessibility: {
                description: 'Daily open, high, low, and close prices. Red ' +
                    'candles mark down days, green candles up days.'
            },
            dataMapping: {
                open: 'Open',
                high: 'High',
                low: 'Low',
                close: 'Close'
            },
            name: 'MICC',
            tooltip: { valuePrefix: '€' },
            type: 'candlestick'
        }, {
            accessibility: {
                description: 'Cumulative trading volume per session.'
            },
            dataMapping: { y: 'Volume' },
            name: 'Volume',
            tooltip: { valueDecimals: 0 },
            type: 'column',
            yAxis: 1
        }]
    });

})();

(async () => {

    const json = await fetch(
        'https://cdn.jsdelivr.net/gh/highcharts/highcharts@a38d619238/samples/data/morningstar/magnum-ice-cream-company-ohlcv.json'
    ).then(r => r.json());

    const rawData = json.ts.results[0].data;

    const ohlc = [];
    const volume = [];

    for (let i = rawData.length - 1; i >= 0; i--) {
        const entry = rawData[i],
            parts = entry['Date Received (GMT)'].split('-'),
            ts = `${parts[2]}-${parts[1]}-${parts[0]}`;

        ohlc.push([
            ts,
            +entry['Open price'],
            +entry['High price'],
            +entry['Low price'],
            +entry['Last price']
        ]);

        volume.push([ts, +entry['Cumulative volume']]);
    }

    Highcharts.stockChart('container', {

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
                color: '#1a1918',
                fontSize: '16px',
                fontWeight: '500'
            },
            text: 'MICC is climbing back from late-April lows after a ' +
                'February shock'
        },

        subtitle: {
            align: 'left',
            style: {
                color: '#64625f',
                fontSize: '12px',
                fontWeight: '300'
            },
            text: 'OHLC and volume, Jan - May 2026 · Source: Morningstar'
        },

        caption: {
            style: {
                color: '#64625f',
                fontSize: '11px',
                fontWeight: '300'
            },
            text: 'The Magnum Ice Cream Company peaked near €20 in early ' +
                'February before a -18% drop on Feb 12 set off a ' +
                'months-long drawdown. Late-April lows of €13 have since ' +
                'given way to a recovery rally.'
        },

        accessibility: {
            keyboardNavigation: {
                focusBorder: {
                    enabled: true,
                    style: {
                        color: '#2364B9',
                        lineWidth: 2
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
                        fill: 'rgba(100, 98, 95, 0.08)',
                        style: { color: '#1a1918' }
                    },
                    select: {
                        fill: 'rgba(35, 100, 185, 0.12)',
                        style: {
                            color: '#2364B9',
                            fontWeight: '500'
                        }
                    }
                },
                stroke: 'none',
                'stroke-width': 0,
                style: { color: '#64625f', fontWeight: '300' }
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
            inputStyle: { color: '#1a1918', fontWeight: '300' },
            labelStyle: { color: '#64625f' },
            selected: 1
        },

        navigator: {
            handles: {
                backgroundColor: '#ffffff',
                borderColor: '#dad9d8'
            },
            maskFill: 'rgba(100, 98, 95, 0.2)',
            outlineColor: '#dad9d8',
            series: {
                type: 'areaspline',
                color: '#2364B9',
                fillColor: 'rgba(35, 100, 185, 0.15)',
                lineWidth: 1
            },
            xAxis: { gridLineColor: '#dad9d8' }
        },

        scrollbar: { enabled: false },

        tooltip: {
            backgroundColor: '#ffffff',
            borderColor: '#dad9d8',
            borderRadius: 4,
            borderWidth: 1,
            shadow: false,
            style: {
                color: '#1a1918',
                fontSize: '12px',
                fontWeight: '300'
            },
            valueDecimals: 2
        },

        xAxis: {
            accessibility: {
                description: 'Trading session dates',
                rangeDescription: 'From January 2 through May 7, 2026'
            },
            labels: {
                style: {
                    color: '#64625f',
                    fontSize: '11px',
                    fontWeight: '300'
                }
            },
            lineColor: '#dad9d8',
            tickColor: '#dad9d8'
        },

        yAxis: [{
            accessibility: {
                description: 'Daily OHLC price in euros',
                rangeDescription: 'Approximately €13 to €20'
            },
            gridLineColor: '#dad9d8',
            gridLineWidth: 1,
            height: '100%',
            labels: {
                align: 'left',
                style: {
                    color: '#64625f',
                    fontSize: '11px',
                    fontWeight: '300'
                },
                x: 8
            },
            lineWidth: 0,
            title: {
                style: {
                    color: '#64625f',
                    fontSize: '11px',
                    fontWeight: '300'
                },
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
                style: {
                    color: '#64625f',
                    fontSize: '10px',
                    fontWeight: '300'
                },
                x: 4,
                y: -2
            },
            lineWidth: 0,
            offset: 0,
            opposite: false,
            title: { text: undefined },
            top: '75%'
        }],

        plotOptions: {
            candlestick: {
                color: '#c52a26',
                lineColor: '#c52a26',
                upColor: '#0a7a13',
                upLineColor: '#0a7a13'
            },
            column: {
                borderWidth: 0,
                color: 'rgba(35, 100, 185, 0.35)'
            },
            series: {
                dataGrouping: { enabled: true }
            }
        },

        series: [{
            accessibility: {
                description: 'Daily open, high, low, and close prices. Red ' +
                    'candles mark down days, green candles up days.'
            },
            data: ohlc,
            name: 'MICC',
            tooltip: { valuePrefix: '€' },
            type: 'candlestick'
        }, {
            accessibility: {
                description: 'Cumulative trading volume per session.'
            },
            data: volume,
            name: 'Volume',
            tooltip: { valueDecimals: 0 },
            type: 'column',
            yAxis: 1
        }]
    });

})();

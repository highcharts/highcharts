(async () => {

    // Load the dataset
    const data = await fetch(
        'https://demo-live-data.highcharts.com/aapl-ohlcv.json'
    ).then(response => response.json());

    // split the data set into ohlc and volume
    const ohlc = [],
        volume = [],
        dataLength = data.length;

    let previousCandleClose = 0;
    for (let i = 0; i < dataLength; i++) {
        ohlc.push([
            data[i][0], // the date
            data[i][1], // open
            data[i][2], // high
            data[i][3], // low
            data[i][4] // close
        ]);

        volume.push({
            x: data[i][0], // the date
            y: data[i][5], // the volume
            color: data[i][4] > previousCandleClose ? '#466742' : '#a23f43',
            labelColor: data[i][4] > previousCandleClose ? '#51a958' : '#ea3d3d'
        });
        previousCandleClose = data[i][4];
    }

    Highcharts.setOptions({
        chart: {
            backgroundColor: '#0a0a0a'
        },
        title: {
            style: {
                color: '#cccccc'
            }
        },
        xAxis: {
            gridLineColor: '#181816',
            labels: {
                style: {
                    color: '#9d9da2'
                }
            }
        },
        yAxis: {
            gridLineColor: '#181816',
            labels: {
                style: {
                    color: '#9d9da2'
                }
            }
        },
        tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            style: {
                color: '#cdcdc9'
            }
        },
        scrollbar: {
            barBackgroundColor: '#464646',
            barBorderRadius: 0,
            barBorderWidth: 0,
            buttonBorderWidth: 0,
            buttonArrowColor: '#cccccc',
            rifleColor: '#cccccc',
            trackBackgroundColor: '#121211',
            trackBorderRadius: 0,
            trackBorderWidth: 1,
            trackBorderColor: '#464646'
        },
        exporting: {
            buttons: {
                contextButton: {
                    theme: {
                        fill: '#121211'
                    }
                }
            }
        }
    });

    Highcharts.stockChart('container', {
        rangeSelector: {
            enabled: false
        },

        navigator: {
            enabled: false
        },

        title: {
            text: 'Candlestick and Volume'
        },

        plotOptions: {
            series: {
                marker: {
                    enabled: false,
                    states: {
                        hover: {
                            enabled: false
                        }
                    }
                }
            },
            candlestick: {
                color: '#ea3d3d',
                upColor: '#51a958',
                upLineColor: '#51a958',
                lineColor: '#ea3d3d'
            }
        },

        xAxis: {
            gridLineWidth: 1,
            crosshair: {
                snap: false
            }
        },

        yAxis: [{
            height: '70%',
            crosshair: {
                snap: false
            },
            accessibility: {
                description: 'price'
            }
        }, {
            top: '70%',
            height: '30%',
            accessibility: {
                description: 'volume'
            }
        }],

        tooltip: {
            shared: true,
            split: false,
            useHTML: true,
            shadow: false,
            positioner: function () {
                return { x: 50, y: 10 };
            }
        },

        series: [{
            type: 'candlestick',
            id: 'aapl',
            name: 'AAPL Stock Price',
            data: ohlc,
            tooltip: {
                valueDecimals: 2,
                pointFormat: '<b>O</b> <span style="color: {point.color}">' +
                    '{point.open} </span>' +
                    '<b>H</b> <span style="color: {point.color}">' +
                    '{point.high}</span><br/>' +
                    '<b>L</b> <span style="color: {point.color}">{point.low} ' +
                    '</span>' +
                    '<b>C</b> <span style="color: {point.color}">' +
                    '{point.close}</span><br/>'
            }
        }, {
            type: 'column',
            name: 'Volume',
            data: volume,
            yAxis: 1,
            borderRadius: 0,
            groupPadding: 0,
            pointPadding: 0,
            tooltip: {
                pointFormat: '<b>Volume</b> <span style="color: ' +
                    '{point.labelColor}">{point.y}</span><br/>'
            }
        }, {
            type: 'ikh',
            linkedTo: 'aapl',
            tooltip: {
                pointFormat: `<br/>
                    <span style="color: #666666;">IKH</span>
                    <br/>
                    tenkan sen: <span
                    style="color:{series.options.tenkanLine.styles.lineColor}">
                    {point.tenkanSen:.3f}</span><br/>' +
                    kijun sen: <span
                    style="color:{series.options.kijunLine.styles.lineColor}">
                    {point.kijunSen:.3f}</span><br/>
                    chikou span: <span
                    style="color:{series.options.chikouLine.styles.lineColor}">
                    {point.chikouSpan:.3f}</span><br/>
                    senkou span A: <span
                    style="color:{series.options.senkouSpanA.styles.lineColor}">
                    {point.senkouSpanA:.3f}</span><br/>
                    senkou span B: <span
                    style="color:{series.options.senkouSpanB.styles.lineColor}">
                    {point.senkouSpanB:.3f}</span><br/>`
            },
            tenkanLine: {
                styles: {
                    lineColor: '#12dbd1'
                }
            },
            kijunLine: {
                styles: {
                    lineColor: '#de70fa'
                }
            },
            chikouLine: {
                styles: {
                    lineColor: '#728efd'
                }
            },
            senkouSpanA: {
                styles: {
                    lineColor: '#2ad156'
                }
            },
            senkouSpanB: {
                styles: {
                    lineColor: '#fca18d'
                }
            },
            senkouSpan: {
                color: 'rgba(255, 255, 255, 0.3)',
                negativeColor: 'rgba(237, 88, 71, 0.2)'
            }
        }]
    });
})();

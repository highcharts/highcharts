(async () => {
    const data = await fetch(
        'https://www.highcharts.com/samples/data/new-intraday.json'
    ).then(response => response.json());

    Highcharts.setOptions({
        lang: {
            rangeSelectorZoom: ''
        }
    });

    Highcharts.stockChart('container', {
        chart: {
            plotBorderWidth: 1,
            plotBorderColor: '#000000',
            marginRight: 30
        },
        title: {
            text: ''
        },
        rangeSelector: {
            buttons: [{
                text: 'M1',
                dataGrouping: {
                    forced: true,
                    units: [
                        ['minute', [1]]
                    ]
                }
            }, {
                text: 'M5',
                dataGrouping: {
                    forced: true,
                    units: [
                        ['minute', [5]]
                    ]
                }
            }, {
                text: 'M15',
                dataGrouping: {
                    forced: true,
                    units: [
                        ['minute', [15]]
                    ]
                }
            }, {
                text: 'M30',
                dataGrouping: {
                    forced: true,
                    units: [
                        ['minute', [30]]
                    ]
                }
            }, {
                text: 'H1',
                dataGrouping: {
                    forced: true,
                    units: [
                        ['hour', [1]]
                    ]
                }
            }, {
                text: 'H4',
                dataGrouping: {
                    forced: true,
                    units: [
                        ['hour', [4]]
                    ]
                }
            }, {
                text: 'D1',
                dataGrouping: {
                    forced: true,
                    units: [
                        ['day', [1]]
                    ]
                }
            }, {
                text: 'W1',
                dataGrouping: {
                    forced: true,
                    units: [
                        ['week', [1]]
                    ]
                }
            }, {
                text: 'MN',
                dataGrouping: {
                    forced: true,
                    units: [
                        ['month', [1]]
                    ]
                }
            }],
            selected: 4,
            inputEnabled: false
        },

        series: [{
            name: 'AAPL',
            type: 'candlestick',
            data: data,
            color: '#000000',
            tooltip: {
                valueDecimals: 2
            },
            lastPrice: {
                enabled: true,
                color: '#c0c0c0',
                label: {
                    enabled: true,
                    backgroundColor: '#000000',
                    padding: 2,
                    shape: 'rect',
                    borderRadius: 0
                }
            }
        }],

        tooltip: {
            positioner: function () {
                return {
                    x: 10,
                    y: 0
                };
            },
            shadow: false,
            borderWidth: 0,
            backgroundColor: 'transparent',
            formatter() {
                const {
                    open,
                    high,
                    low,
                    close
                } = this.point;
                return `${this.series.name} ${open} ${high} ${low} ${close}`;
            }
        },

        xAxis: {
            gridLineWidth: 1,
            gridLineColor: '#c0c0c0',
            gridLineDashStyle: 'Dash',
            crosshair: {
                snap: false,
                label: {
                    enabled: true,
                    format: '{value:%d %b %k:%M}',
                    backgroundColor: '#000000',
                    padding: 2,
                    shape: 'rect',
                    borderRadius: 0
                }
            },
            startOnTick: true,
            tickLength: 5,
            labels: {
                distance: 4,
                formatter() {
                    const isAboveD1 =
                        this.chart.series[0].currentDataGrouping.unitRange >=
                        86400000;

                    if (this.isFirst || isAboveD1) {
                        return this.chart.time.dateFormat('%d %b %Y', this.value);
                    }
                    return this.chart.time.dateFormat('%d %b %k:%M', this.value);
                }
            }
        },
        yAxis: {
            gridLineWidth: 1,
            gridLineColor: '#c0c0c0',
            gridLineDashStyle: 'Dash',
            tickInterval: 5,
            crosshair: {
                snap: false,
                label: {
                    enabled: true,
                    format: '{value:.2f}',
                    backgroundColor: '#000000',
                    padding: 2,
                    shape: 'rect',
                    borderRadius: 0
                }
            },
            left: 35
        }
    });
})();

async function renderCharts() {

    const commonConnectorOptions = {
        api: {
            url: 'https://demo-live-data.highcharts.com',
            access: {
                url: 'https://demo-live-data.highcharts.com/token/oauth',
                token: 'token'
            }
        },
        currencyId: 'EUR',
        dataPoints: {
            type: 'portfolio',
            dataPoints: [
                [
                    'PerformanceReturn',
                    'M1',
                    'M2',
                    'M3',
                    'M6',
                    'M12',
                    'M36',
                    'M60'
                ],
                [
                    'StandardDeviation',
                    'M',
                    'M1',
                    'M2',
                    'M3',
                    'M6',
                    'M12',
                    'M36',
                    'M60'
                ]
            ]
        },
        startDate: '2020-01-01'
    };

    const connectors = {
        FSPGX: new HighchartsConnectors.Morningstar.XRayConnector({
            ...commonConnectorOptions,
            holdings: [{
                id: 'US31635V7293', // Fidelity Large Cap Growth Index Fund
                idType: 'ISIN',
                type: 'FO',
                weight: 100
            }]
        }),
        MULMBGGU: new HighchartsConnectors.Morningstar.XRayConnector({
            ...commonConnectorOptions,
            holdings: [{
                id: 'F00001667W', // Morningstar US LM Brd Growth TR USD
                idType: 'MSID',
                type: 'FO',
                weight: 100
            }]
        }),
        MLGRT: new HighchartsConnectors.Morningstar.XRayConnector({
            ...commonConnectorOptions,
            holdings: [{
                id: 'XIUSA0010Z', // Morningstar US Large Growth
                idType: 'MSID',
                type: 'FO',
                weight: 100
            }]
        })
    };

    for (const key in connectors) {
        if (Object.prototype.hasOwnProperty.call(connectors, key)) {
            await connectors[key].load();
        }
    }

    const columns = {
        FSPGX: {
            TimePeriod:
                connectors.FSPGX.getTable('TrailingPerformance').getColumn(
                    'TotalReturn_MonthEnd_TimePeriod'
                ),
            Return: connectors.FSPGX.getTable('TrailingPerformance').getColumn(
                'TotalReturn_MonthEnd_Value'
            ),
            StandardDeviation:
                connectors.FSPGX.getTable('RiskStatistics').getColumn(
                    'StandardDeviation'
                )
        },
        MULMBGGU: {
            TimePeriod:
                connectors.MULMBGGU.getTable('TrailingPerformance').getColumn(
                    'TotalReturn_MonthEnd_TimePeriod'
                ),
            Return: connectors.MULMBGGU.getTable('TrailingPerformance')
                .getColumn(
                    'TotalReturn_MonthEnd_Value'
                ),
            StandardDeviation:
                connectors.MULMBGGU.getTable('RiskStatistics').getColumn(
                    'StandardDeviation'
                )
        },
        MLGRT: {
            TimePeriod:
                connectors.MLGRT.getTable('TrailingPerformance').getColumn(
                    'TotalReturn_MonthEnd_TimePeriod'
                ),
            Return: connectors.MLGRT.getTable('TrailingPerformance').getColumn(
                'TotalReturn_MonthEnd_Value'
            ),
            StandardDeviation:
                connectors.MLGRT.getTable('RiskStatistics').getColumn(
                    'StandardDeviation'
                )
        }
    };

    const periodIndex = columns.FSPGX.TimePeriod.indexOf('M6');

    if (periodIndex === -1) {
        return;
    }

    const chart = Highcharts.chart('charts-container', {
        chart: {
            type: 'scatter',
            plotBorderColor: '#E1E1E1',
            plotBorderWidth: 1
        },
        credits: {
            enabled: false
        },
        legend: {
            align: 'right',
            verticalAlign: 'top',
            floating: true
        },
        title: {
            text: 'Risk/Return',
            align: 'left',
            x: 70
        },
        subtitle: {
            text: '6-months period',
            align: 'left',
            x: 70
        },
        tooltip: {
            pointFormat:
                '<b>Total Return (%):</b> {point.y}' +
                '<br> <b>Standard Deviation:</b> {point.x}'
        },
        xAxis: {
            lineWidth: 0,
            tickColor: '#E1E1E1',
            title: {
                text: 'Standard Deviation'
            },
            plotLines: [{
                value: columns.MULMBGGU.StandardDeviation[periodIndex],
                dashStyle: 'Dash',
                color: '#2F2E38',
                id: 'plot-line-std-dev'
            }],
            labels: {
                format: '{value:.2f}'
            }
        },
        yAxis: {
            gridLineColor: '#0000A',
            title: {
                text: 'Total Return %'
            },
            plotLines: [{
                value: columns.MULMBGGU.Return[periodIndex],
                dashStyle: 'Dash',
                color: '#2F2E38',
                id: 'plot-line-risk'
            }],
            labels: {
                format: '{value:.2f}'
            }
        },
        series: [{
            name: 'Fidelity® Large Cap Growth Idx',
            data: [
                [
                    columns.FSPGX.StandardDeviation[periodIndex],
                    columns.FSPGX.Return[periodIndex]
                ]
            ],
            color: '#014CE5',
            marker: {
                symbol: 'circle'
            }
        }, {
            name: 'Index',
            data: [
                [
                    columns.MULMBGGU.StandardDeviation[periodIndex],
                    columns.MULMBGGU.Return[periodIndex]
                ]
            ],
            color: '#2F2E38',
            marker: {
                symbol: 'rect'
            }
        }, {
            name: 'Category',
            data: [
                [
                    columns.MLGRT.StandardDeviation[periodIndex],
                    columns.MLGRT.Return[periodIndex]
                ]
            ],
            color: '#EA293C',
            marker: {
                symbol: 'circle'
            }
        }]
    });

    function updateChart(timePeriod) {
        const periodIndex = columns.FSPGX.TimePeriod.indexOf(timePeriod);

        if (periodIndex === -1) {
            return;
        }

        chart.xAxis[0].removePlotLine('plot-line-std-dev');
        chart.yAxis[0].removePlotLine('plot-line-risk');

        chart.xAxis[0].addPlotLine({
            value: columns.MULMBGGU.StandardDeviation[periodIndex],
            dashStyle: 'Dash',
            color: '#a50032',
            id: 'plot-line-std-dev'
        });

        chart.yAxis[0].addPlotLine({
            value: columns.MULMBGGU.Return[periodIndex],
            dashStyle: 'Dash',
            color: '#a50032',
            id: 'plot-line-risk'
        });

        chart.series[0].points[0].update([
            columns.FSPGX.StandardDeviation[periodIndex],
            columns.FSPGX.Return[periodIndex],
            false
        ]);

        chart.series[1].points[0].update([
            columns.MULMBGGU.StandardDeviation[periodIndex],
            columns.MULMBGGU.Return[periodIndex],
            false
        ]);

        chart.series[2].points[0].update([
            columns.MLGRT.StandardDeviation[periodIndex],
            columns.MLGRT.Return[periodIndex],
            false
        ]);

        chart.update({
            subtitle: {
                text:
                    `${timePeriod.slice(1)}-${timePeriod.slice(1) === 1 ?
                        'month' : 'months'} period`
            }
        }, false);

        chart.redraw();
    }

    function setupTabs() {
        const tabs = document.querySelectorAll('.tab');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                const selectedPeriod = tab.getAttribute('data-period');
                updateChart(selectedPeriod);
            });
        });
    }

    setupTabs();
}

renderCharts();

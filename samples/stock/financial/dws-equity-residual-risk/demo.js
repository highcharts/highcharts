async function renderChart() {

    // Configure the connector
    const connector =
        new HighchartsConnectors.MorningstarDWS.InvestmentsConnector({
            api: {
                url: 'https://demo-live-data.highcharts.com',
                access: {
                    url: 'https://demo-live-data.highcharts.com/token/oauth',
                    token: 'token'
                }
            },
            security: {
                id: '0P00006W6Q'
            },
            converters: {
                EquityResidualRisk: {}
            }
        });

    // Load data
    await connector.load();

    // Get daily data table
    const riskDailyTable = connector.getTable('RiskDaily'),
        dailyCategories = riskDailyTable.getRows(
            void 0,
            void 0,
            ['Type']
        )
            .flat()
            .map(item => item.replace(/(\d+)([A-Za-z]+)/u, '$1 $2'));

    // Set global options
    Highcharts.setOptions({
        chart: {
            type: 'column'
        },
        colors: ['#274FE0', '#E1E1E6'],
        tooltip: {
            shared: true
        },
        xAxis: {
            crosshair: true
        },
        plotOptions: {
            series: {
                minPointLength: 2
            }
        }
    });

    // Create chart
    Highcharts.chart('container-daily-alpha', {
        title: {
            text: 'Daily Values - Alpha'
        },
        tooltip: {
            valueSuffix: '%'
        },
        xAxis: {
            categories: dailyCategories
        },
        yAxis: {
            title: {
                text: 'Alpha'
            },
            labels: {
                format: '{value}%'
            }
        },
        series: [{
            name: 'Alpha',
            data: riskDailyTable.getRows(
                void 0,
                void 0,
                ['Alpha']
            )
        }, {
            name: 'Non Dividend Alpha',
            data: riskDailyTable.getRows(
                void 0,
                void 0,
                ['NonDividendAlpha']
            )
        }]
    });

    // Create chart
    Highcharts.chart('container-daily-beta', {
        title: {
            text: 'Daily Values - Beta'
        },
        xAxis: {
            categories: dailyCategories
        },
        yAxis: [{
            title: {
                text: 'Beta'
            },
            plotLines: [{
                color: '#6B7280',
                value: 1,
                width: 2
            }]
        }, {
            linkedTo: 0,
            opposite: true,
            title: {
                text: ''
            },
            tickPositions: [1],
            labels: {
                format: '{#if (eq value 1)}Market<br>(β = 1.0){/if}'
            }
        }],
        series: [{
            name: 'Beta',
            data: riskDailyTable.getRows(
                void 0,
                void 0,
                ['Beta']
            )
        }, {
            name: 'Non Dividend Beta',
            data: riskDailyTable.getRows(
                void 0,
                void 0,
                ['NonDividendBeta']
            )
        }]
    });

    // Create chart
    Highcharts.chart('container-daily-rsquare', {
        title: {
            text: 'Daily Values - R-Square'
        },
        tooltip: {
            valueSuffix: '%'
        },
        xAxis: {
            categories: dailyCategories
        },
        yAxis: {
            title: {
                text: 'R-Square'
            },
            labels: {
                format: '{value}%'
            }
        },
        series: [{
            name: 'R-Square',
            data: riskDailyTable.getRows(
                void 0,
                void 0,
                ['RSquare']
            )
        }, {
            name: 'Non Dividend R-Square',
            data: riskDailyTable.getRows(
                void 0,
                void 0,
                ['NonDividendRSquare']
            )
        }]
    });

    // Get monthly data table
    const riskMonthlyTable = connector.getTable('RiskMonthly'),
        monthlyCategories = riskMonthlyTable.getRows(
            void 0,
            void 0,
            ['Type']
        )
            .flat()
            .map(item => item.replace(/(\d+)([A-Za-z]+)/u, '$1 $2'));

    // Create chart
    Highcharts.chart('container-monthly-alpha', {
        title: {
            text: 'Monthly Values - Alpha'
        },
        tooltip: {
            valueSuffix: '%'
        },
        xAxis: {
            categories: monthlyCategories
        },
        yAxis: {
            title: {
                text: 'Alpha'
            },
            labels: {
                format: '{value}%'
            }
        },
        series: [{
            name: 'Alpha',
            data: riskMonthlyTable.getRows(
                void 0,
                void 0,
                ['Alpha']
            )
        }, {
            name: 'Non Dividend Alpha',
            data: riskMonthlyTable.getRows(
                void 0,
                void 0,
                ['NonDividendAlpha']
            )
        }]
    });

    // Create chart
    Highcharts.chart('container-monthly-beta', {
        title: {
            text: 'Monthly Values - Beta'
        },
        xAxis: {
            categories: monthlyCategories
        },
        yAxis: [{
            title: {
                text: 'Beta'
            },
            plotLines: [{
                color: '#6B7280',
                value: 1,
                width: 2
            }]
        }, {
            linkedTo: 0,
            opposite: true,
            title: {
                text: ''
            },
            tickPositions: [1],
            labels: {
                format: '{#if (eq value 1)}Market<br>(β = 1.0){/if}'
            }
        }],
        series: [{
            name: 'Beta',
            data: riskMonthlyTable.getRows(
                void 0,
                void 0,
                ['Beta']
            )
        }, {
            name: 'Non Dividend Beta',
            data: riskMonthlyTable.getRows(
                void 0,
                void 0,
                ['NonDividendBeta']
            )
        }]
    });

    // Create chart
    Highcharts.chart('container-monthly-rsquare', {
        title: {
            text: 'Monthly Values - R-Square'
        },
        tooltip: {
            valueSuffix: '%'
        },
        xAxis: {
            categories: monthlyCategories
        },
        yAxis: {
            title: {
                text: 'R-Square'
            },
            labels: {
                format: '{value}%'
            }
        },
        series: [{
            name: 'R-Square',
            data: riskMonthlyTable.getRows(
                void 0,
                void 0,
                ['RSquare']
            )
        }, {
            name: 'Non Dividend R-Square',
            data: riskMonthlyTable.getRows(
                void 0,
                void 0,
                ['NonDividendRSquare']
            )
        }]
    });
}

renderChart();

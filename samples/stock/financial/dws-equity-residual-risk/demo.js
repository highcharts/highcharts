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
        dailyCategories = riskDailyTable.getColumn('Type')
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
        },

        responsive: {
            rules: [{
                condition: {
                    maxWidth: 350
                },
                chartOptions: {
                    yAxis: {
                        title: null
                    }
                }
            }]
        }
    });

    // Create chart
    Highcharts.chart('container-daily-alpha', {
        dataTable: riskDailyTable,
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
            dataMapping: {
                y: 'Alpha'
            }
        }, {
            name: 'Non Dividend Alpha',
            dataMapping: {
                y: 'NonDividendAlpha'
            }
        }]
    });

    // Create chart
    Highcharts.chart('container-daily-beta', {
        dataTable: riskDailyTable,
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
            dataMapping: {
                y: 'Beta'
            }
        }, {
            name: 'Non Dividend Beta',
            dataMapping: {
                y: 'NonDividendBeta'
            }
        }]
    });

    // Create chart
    Highcharts.chart('container-daily-rsquare', {
        dataTable: riskDailyTable,
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
            dataMapping: {
                y: 'RSquare'
            }
        }, {
            name: 'Non Dividend R-Square',
            dataMapping: {
                y: 'NonDividendRSquare'
            }
        }]
    });

    // Get monthly data table
    const riskMonthlyTable = connector.getTable('RiskMonthly'),
        monthlyCategories = riskMonthlyTable.getColumn('Type')
            .map(item => item.replace(/(\d+)([A-Za-z]+)/u, '$1 $2'));

    // Create chart
    Highcharts.chart('container-monthly-alpha', {
        dataTable: riskMonthlyTable,
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
            dataMapping: {
                y: 'Alpha'
            }
        }, {
            name: 'Non Dividend Alpha',
            dataMapping: {
                y: 'NonDividendAlpha'
            }
        }]
    });

    // Create chart
    Highcharts.chart('container-monthly-beta', {
        dataTable: riskMonthlyTable,
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
            dataMapping: {
                y: 'Beta'
            }
        }, {
            name: 'Non Dividend Beta',
            dataMapping: {
                y: 'NonDividendBeta'
            }
        }]
    });

    // Create chart
    Highcharts.chart('container-monthly-rsquare', {
        dataTable: riskMonthlyTable,
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
            dataMapping: {
                y: 'RSquare'
            }
        }, {
            name: 'Non Dividend R-Square',
            dataMapping: {
                y: 'NonDividendRSquare'
            }
        }]
    });
}

renderChart();

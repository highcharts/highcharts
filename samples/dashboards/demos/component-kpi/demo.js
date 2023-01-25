function random(max, min = 0) {
    return Math.floor(min + Math.random() * (max - min));
}

const dashboard = new Dashboards.Dashboard('container', {
    components: [{
        cell: 'kpi-00',
        type: 'KPI',
        title: 'Average revenue',
        value: 888,
        threshold: [200, 800],
        thresholdColors: ['#f45b5b', '#f7a35c', '#90ed7d']
    }, {
        cell: 'kpi-01',
        type: 'KPI',
        title: 'Earnings',
        value: 900,
        subtitle: {
            type: 'diff'
        }
    },  {
        cell: 'kpi-02',
        type: 'KPI',
        title: 'Cakes',
        value: 7,
        subtitle: 'Consumed daily',
        chartOptions: {
            series: [{
                data: [734, 244, 685, 250, 920, 320, 200, 150]
            }]
        }
    }, {
        cell: 'kpi-03',
        type: 'KPI',
        title: 'Active users',
        value: 70
    }, {
        cell: 'kpi-10',
        type: 'KPI',
        title: 'Change',
        value: 222,
        valueFormatter: v => `${(v / 10).toFixed(1)}%`
    }, {
        cell: 'kpi-11',
        type: 'KPI',
        title: 'Cash',
        value: 88,
        valueFormat: '${value:,.2f}',
        subtitle: {
            type: 'diffpercent'
        }
    }, {
        cell: 'kpi-12',
        type: 'KPI',
        title: 'Progress',
        chartOptions: {
            chart: {
                type: 'solidgauge'
            },
            pane: {
                startAngle: -150,
                endAngle: 150,
                background: {
                    backgroundColor: '#EEE',
                    innerRadius: '60%',
                    outerRadius: '100%',
                    shape: 'arc'
                }
            },
            yAxis: {
                min: 0,
                max: 1000
            },
            series: [{
                dataLabels: {
                    enabled: false
                },
                rounded: true,
                data: [{
                    color: Highcharts.getOptions().colors[0],
                    y: 70,
                    innerRadius: '60%',
                    outerRadius: '100%'
                }]
            }]
        }
    }, {
        cell: 'kpi-13',
        type: 'KPI',
        title: 'Visits last 24 hours',
        chartOptions: {
            yAxis: {
                min: 0,
                max: 1000,
                visible: true
            },
            series: [{
                data: [130, 405, 200, 500, 100, 300, 200, 150],
                clip: false
            }]
        }
    }],
    gui: {
        enabled: true,
        layouts: [{
            id: 'layout-1',
            rows: [{
                cells: [{
                    id: 'kpi-00'
                }, {
                    id: 'kpi-01'
                }, {
                    id: 'kpi-02'
                }, {
                    id: 'kpi-03'
                }]
            }, {
                cells: [{
                    id: 'kpi-10'
                }, {
                    id: 'kpi-11'
                }, {
                    id: 'kpi-12'
                }, {
                    id: 'kpi-13'
                }]
            }]
        }]
    }
});

function setValues() {
    dashboard.mountedComponents.forEach(element => {
        const chart = element.component.chart,
            randomValue = random(1000);

        if (chart && chart.options.chart.type !== 'solidgauge') {
            chart.series[0].addPoint(
                randomValue,
                true,
                true
            );
        } else if (chart) {
            chart.series[0].setData([randomValue]);
        }
        element.component.update({
            value: randomValue
        });
    });
}
// Set some initial data
setValues();

// Update the data every second
setInterval(() => {
    setValues();
}, 1000);

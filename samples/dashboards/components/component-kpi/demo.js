Highcharts.setOptions({
    chart: {
        styledMode: true
    }
});

function random(max, min = 0) {
    return Math.floor(min + Math.random() * (max - min));
}

const board = Dashboards.board('container', {
    components: [{
        renderTo: 'kpi-00',
        type: 'KPI',
        value: 888
    }, {
        renderTo: 'kpi-01',
        type: 'KPI',
        value: 900
    },  {
        renderTo: 'kpi-02',
        type: 'KPI',
        title: 'Cakes',
        value: 7,
        subtitle: 'Consumed daily',
        linkedValueTo: {
            enabled: false
        },
        chartOptions: {
            series: [{
                data: [734, 244, 685, 250, 920, 320, 200, 150]
            }]
        }
    }, {
        renderTo: 'kpi-03',
        type: 'KPI',
        title: 'Active users'
    }, {
        renderTo: 'kpi-10',
        type: 'KPI',
        title: 'Change',
        value: 222,
        valueFormatter: v => `${(v / 10).toFixed(1)}%`
    }, {
        renderTo: 'kpi-11',
        type: 'KPI',
        title: 'Cash',
        value: 88,
        valueFormat: '${value:,.2f}',
        subtitle: {
            type: 'diffpercent'
        }
    }, {
        renderTo: 'kpi-12',
        type: 'KPI',
        title: 'Progress',
        value: 70,
        chartOptions: {
            chart: {
                type: 'solidgauge'
            },
            pane: {
                startAngle: -150,
                endAngle: 150,
                background: {
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
                    innerRadius: '60%',
                    outerRadius: '100%'
                }]
            }]
        }
    }, {
        renderTo: 'kpi-13',
        type: 'KPI',
        title: 'Visits last 24 hours',
        linkedValueTo: {
            enabled: false
        },
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
        layouts: [{
            id: 'layout-1',
            rows: [{
                cells: [{
                    id: 'kpi-00'
                }, {
                    id: 'kpi-01'
                }]
            }, {
                cells: [{
                    id: 'kpi-02'
                }, {
                    id: 'kpi-03'
                }]
            }, {
                cells: [{
                    id: 'kpi-10'
                }, {
                    id: 'kpi-11'
                }]
            }, {
                cells: [{
                    id: 'kpi-12'
                }, {
                    id: 'kpi-13'
                }]
            }]
        }]
    }
});

function setValues() {
    board.mountedComponents.forEach(element => {
        const chart = element.component.chart,
            randomValue = random(1000);

        if (chart && chart.options.chart.type !== 'solidgauge') {
            chart.series[0].addPoint(
                randomValue,
                true,
                true
            );
        }

        element.component.update({
            value: randomValue
        });
    });
}

// Update the data every second
setInterval(() => {
    setValues();
}, 1000);

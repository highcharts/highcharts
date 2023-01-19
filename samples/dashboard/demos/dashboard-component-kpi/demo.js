function random(max, min = 0) {
    return Math.floor(min + Math.random() * (max - min));
}

const dashboard = new Dashboard.Dashboard('container', {
    components: [{
        cell: 'kpi-00',
        type: 'kpi',
        title: 'Average revenue',
        value: 888,
        threshold: [200, 800],
        thresholdColors: ['#f45b5b', '#f7a35c', '#90ed7d']
    }, {
        cell: 'kpi-01',
        type: 'kpi',
        title: 'Earnings',
        value: 900,
        subtitle: {
            type: 'diff'
        }
    },  {
        cell: 'kpi-02',
        type: 'kpi',
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
        type: 'kpi',
        title: 'Active users',
        value: 70
    }, {
        cell: 'kpi-10',
        type: 'kpi',
        title: 'Change',
        value: 222,
        valueFormatter: v => `${(v / 10).toFixed(1)}%`
    }, {
        cell: 'kpi-11',
        type: 'kpi',
        title: 'Cash',
        value: 88,
        valueFormat: '${value:,.2f}',
        subtitle: {
            type: 'diffpercent'
        }
    }, {
        cell: 'kpi-12',
        type: 'kpi',
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
        type: 'kpi',
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
            }, {
                cells: [{
                    id: 'kpi-20' // for threshold
                }]
            }]
        }]
    }
});

function setValues(element) {
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
}

dashboard.mountedComponents.forEach(element => {
    setValues(element);
    setInterval(() => {
        setValues(element);
    }, 1000);
});


// const threshold = [{
//     component: HTMLComponent,
//     options: {
//         elements: [{
//             tagName: 'img',
//             attributes: {
//                 src: 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/apple/285/ok-hand_1f44c.png'
//             }
//         }]
//     },
//     value: 69,
//     thresholds: [{
//         min: 50,
//         component: KPIComponent,
//         options: {
//             title: 'Errors'
//         }
//     }, {
//         min: 1000,
//         options: {
//             title: 'Tons of errors!'
//         }
//     }, {
//         min: 9001,
//         options: {
//             title: {
//                 text: 'Its over 9000!!!',
//                 style: {
//                     fontWeight: 700
//                 }
//             },
//             style: {
//                 color: 'red',
//                 background: 'black'
//             }
//         }
//     }]
// }].map(config => {
//     const parentElement = document.createElement('div');
//     parents.push(parentElement);
//     container.appendChild(parentElement);
//     resize(parentElement);
//     return new ThresholdComponent({
//         parentElement,
//         ...config
//     }).render();
// });

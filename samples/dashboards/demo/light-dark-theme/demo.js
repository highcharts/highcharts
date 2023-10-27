const data = [
    ['Food', 'Vitamin A'],
    ['Beef Liver', 6421],
    ['Lamb Liver', 2122],
    ['Cod Liver Oil', 1350],
    ['Mackerel', 388],
    ['Tuna', 214]
];

Dashboards.board('container', {
    dataPool: {
        connectors: [{
            id: 'sample',
            type: 'JSON',
            options: {
                data
            }
        }]
    },
    gui: {
        layouts: [{
            id: 'layout-1',
            rows: [{
                cells: [{
                    responsive: {
                        small: {
                            width: '100%'
                        },
                        medium: {
                            width: '50%'
                        },
                        large: {
                            width: '50%'
                        }

                    },
                    id: 'dashboard-col-0'
                }, {
                    responsive: {
                        small: {
                            width: '100%'
                        },
                        medium: {
                            width: '50%'
                        },
                        large: {
                            width: '50%'
                        }

                    },
                    id: 'dashboard-col-1'
                }]
            }]
        }]
    },
    components: [
        {
            cell: 'dashboard-col-0',
            connector: {
                id: 'sample'
            },
            type: 'Highcharts',
            sync: {
                highlight: true
            },
            columnAssignment: {
                Food: 'x',
                'Vitamin A': 'y'
            },
            title: {
                text: 'Vitamin A'
            },
            chartOptions: {
                xAxis: {
                    type: 'category'
                },
                yAxis: {
                    title: ''
                },
                credits: {
                    enabled: false
                },
                title: {
                    text: ''
                },
                subtitle: {
                    text: 'in Various Foods',
                    align: 'left',
                    y: 10
                },
                legend: {
                    enabled: false
                },
                chart: {
                    animation: false,
                    type: 'packedbubble',
                    margin: 0,
                    spacing: [0, 10, 10, 10]
                },
                plotOptions: {
                    series: {
                        colorByPoint: true,
                        maxSize: '100%',
                        minSize: '40%',
                        dataLabels: {
                            enabled: true,
                            format: '{key}',
                            style: {
                                textOuline: '1px'
                            }
                        },
                        tooltip: {
                            headerFormat: '{point.key}:',
                            pointFormat: ' {point.y}'
                        }
                    }
                }
            }
        }, {
            cell: 'dashboard-col-1',
            type: 'DataGrid',
            connector: {
                id: 'sample'
            },
            className: 'datagrid',
            editable: true,
            sync: {
                highlight: true
            }
        }
    ]
}, true);

[...document.querySelectorAll('input[name="color-mode"]')]
    .forEach(input => {
        input.addEventListener('click', e => {
            document.getElementById('container').className =
                e.target.value === 'none' ? '' : `highcharts-${e.target.value}`;
        });
    });

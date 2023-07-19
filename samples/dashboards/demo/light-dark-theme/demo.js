const csvData = document.getElementById('csv').innerText;

Dashboards.board('container', {
    dataPool: {
        connectors: [{
            id: 'sample',
            type: 'CSV',
            options: {
                csv: csvData
            }
        }]
    },
    gui: {
        layouts: [{
            id: 'layout-1',
            rows: [{
                cells: [{
                    id: 'dashboard-col-0'
                }, {
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
            editable: true,
            title: {
                text: 'Data Grid Component'
            },
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

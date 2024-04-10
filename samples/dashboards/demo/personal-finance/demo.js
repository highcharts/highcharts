Dashboards.board('container', {
    dataPool: {
        connectors: [{
            id: 'transactions',
            type: 'JSON',
            options: {
                firstRowAsNames: false,
                columnNames: ['id', 'Receiver', 'Amount', 'Balance'],
                data: [
                    ['rsf934fds', 'John Doe', 100, 1000],
                    ['f0efnakr', 'Anna Smith', 200, 800],
                    ['mfaiks12', 'Robert Johnson', 300, 500],
                    ['15fqmfk', 'Susan Williams', 400, 100]
                ]
            }
        }]
    },
    gui: {
        layouts: [{
            rows: [{
                id: 'row-1',
                cells: [{
                    id: 'dashboard-row-1-cell-1'
                }, {
                    id: 'dashboard-row-1-cell-2'
                }, {
                    id: 'dashboard-row-1-cell-3'
                }]
            }, {
                cells: [{
                    id: 'dashboard-row-2-cell-1'
                }]
            }, {
                cells: [{
                    id: 'dashboard-row-3-cell-1'
                }, {
                    id: 'dashboard-row-3-cell-2'
                }, {
                    id: 'dashboard-row-3-cell-3'
                }]
            }]
        }]
    },
    components: [{
        type: 'KPI',
        renderTo: 'dashboard-row-1-cell-1',
        title: 'Total balance',
        value: 1430,
        valueFormat: '$ {value}',
        subtitle: '43%',
        linkedValueTo: {
            enabled: false
        },
        chartOptions: {
            chart: {
                styledMode: true
            },
            series: [{
                type: 'spline',
                enableMouseTracking: false,
                dataLabels: {
                    enabled: false
                },
                data: [1870, 1210, 1500, 1900, 1430]
            }]
        }
    }, {
        type: 'KPI',
        renderTo: 'dashboard-row-1-cell-2',
        title: 'Savings',
        value: 6500,
        valueFormat: '$ {value}',
        subtitle: '22%',
        linkedValueTo: {
            enabled: false
        },
        chartOptions: {
            chart: {
                styledMode: true
            },
            series: [{
                type: 'spline',
                enableMouseTracking: false,
                dataLabels: {
                    enabled: false
                },
                data: [0, 1000, 1000, 4500, 5300, 6500]
            }]
        }
    }, {
        type: 'HTML',
        renderTo: 'dashboard-row-1-cell-3',
        elements: [{
            tagName: 'div',
            children: [{
                tagName: 'h4',
                textContent: 'Check how you can save more!',
                attributes: {
                    class: 'main-title'
                }
            }, {
                tagName: 'button',
                textContent: 'Go to the saving account',
                attributes: {
                    id: 'saving-button'
                }
            }]
        }]
    }, {
        type: 'Highcharts',
        renderTo: 'dashboard-row-2-cell-1',
        title: 'Earnings',
        chartOptions: {
            chart: {
                marginTop: 50
            },
            defs: {
                gradient0: {
                    tagName: 'linearGradient',
                    id: 'gradient-0',
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 1,
                    children: [{
                        tagName: 'stop',
                        offset: 0
                    }, {
                        tagName: 'stop',
                        offset: 1
                    }]
                }
            },
            credits: {
                enabled: false
            },
            title: {
                text: ''
            },
            legend: {
                enabled: false
            },
            xAxis: {
                categories: [
                    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
                ]
            },
            yAxis: [{
                title: '',
                labels: {
                    format: '{value} k'
                }
            }],
            series: [{
                type: 'areaspline',
                dataLabels: {
                    enabled: false
                },
                marker: {
                    enabled: false
                },
                name: 'Earnings',
                data: [10, 20, 30, 40, 12, 11, 10, 23, 4, 34, 50, 20]
            }]
        }
    }, {
        type: 'KPI',
        renderTo: 'dashboard-row-3-cell-1',
        title: 'Spendings',
        value: 350,
        valueFormat: '$ {value}',
        linkedValueTo: {
            enabled: false
        },
        chartOptions: {
            series: [{
                type: 'column',
                enableMouseTracking: false,
                dataLabels: {
                    enabled: false
                },
                name: 'Spendings',
                data: [45, 30, 50, 80, 10, 45, 30, 59, 39, 15, 62]
            }]
        }
    }, {
        type: 'KPI',
        renderTo: 'dashboard-row-3-cell-2',
        title: 'Your wallet condition',
        value: '',
        subtitle: 'You saved 1450$ this month',
        linkedValueTo: {
            enabled: false
        },
        chartOptions: {
            title: {
                verticalAlign: 'middle',
                floating: true,
                text: '58%'
            },
            series: [{
                type: 'pie',
                enableMouseTracking: false,
                data: [58, 42],
                size: '100%',
                innerSize: '75%',
                dataLabels: {
                    enabled: false
                }
            }]
        }
    }, {
        renderTo: 'dashboard-row-3-cell-3',
        connector: {
            id: 'transactions'
        },
        title: 'Transactions',
        type: 'DataGrid',
        dataGridOptions: {
            cellHeight: 37,
            editable: false
        }
    }]
}, true);

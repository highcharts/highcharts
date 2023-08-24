const csvData = document.getElementById('csv').innerText;

Dashboards.board('container', {
    dataPool: {
        connectors: [{
            id: 'Vitamin',
            type: 'CSV',
            options: {
                csv: csvData
            }
        }]
    },
    editMode: {
        enabled: true,
        contextMenu: {
            enabled: true,
            items: ['editMode']
        }
    },
    gui: {
        layouts: [{
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
                            width: '30%'
                        }
                    },
                    layout: {
                        rows: [{
                            cells: [{
                                id: 'kpi-vitamin-a',
                                responsive: {
                                    small: {
                                        width: '50%'
                                    },
                                    medium: {
                                        width: '100%'
                                    },
                                    large: {
                                        width: '100%'
                                    }
                                },
                                height: 205
                            }, {
                                responsive: {
                                    small: {
                                        width: '50%'
                                    },
                                    medium: {
                                        width: '100%'
                                    },
                                    large: {
                                        width: '100%'
                                    }
                                },
                                id: 'kpi-iron',
                                height: 205
                            }]
                        }]
                    }
                }, {
                    id: 'dashboard-col-0'
                }, {
                    id: 'dashboard-col-1'
                }]
            }, {
                cells: [{
                    id: 'dashboard-col-2'
                }]
            }]
        }]
    },
    components: [{
        type: 'KPI',
        cell: 'kpi-vitamin-a',
        value: 900,
        valueFormat: '{value}',
        title: 'Vitamin A',
        subtitle: 'daily recommended dose'
    }, {
        type: 'KPI',
        cell: 'kpi-iron',
        value: 8,
        title: 'Iron',
        valueFormat: '{value}',
        subtitle: 'daily recommended dose'
    }, {
        cell: 'title',
        type: 'HTML',
        elements: [{
            tagName: 'h1',
            textContent: 'MicroElement amount in Foods'
        }]
    }, {
        sync: {
            visibility: true,
            highlight: true,
            extremes: true
        },
        connector: {
            id: 'Vitamin'
        },
        cell: 'dashboard-col-0',
        type: 'Highcharts',
        columnAssignment: {
            Food: 'x',
            'Vitamin A': 'value'
        },
        chartOptions: {
            xAxis: {
                type: 'category'
            },
            yAxis: {
                title: {
                    text: 'mcg'
                },
                plotLines: [{
                    value: 900,
                    zIndex: 7,
                    dashStyle: 'shortDash',
                    label: {
                        text: 'RDA',
                        align: 'right',
                        style: {
                            color: '#B73C28'
                        }
                    }
                }]
            },
            credits: {
                enabled: false
            },
            plotOptions: {
                series: {
                    marker: {
                        radius: 6
                    }
                }
            },
            legend: {
                enabled: true,
                verticalAlign: 'top'
            },
            chart: {
                animation: false,
                type: 'column',
                spacing: [30, 30, 30, 20]
            },
            title: {
                text: ''
            }
        }
    },
    {
        cell: 'dashboard-col-1',
        sync: {
            visibility: true,
            highlight: true,
            extremes: true
        },
        connector: {
            id: 'Vitamin'
        },
        type: 'Highcharts',
        columnAssignment: {
            Food: 'x',
            Iron: 'y'
        },
        chartOptions: {
            xAxis: {
                type: 'category'
            },
            yAxis: {
                title: {
                    text: 'mcg'
                },
                max: 8,
                plotLines: [{
                    value: 8,
                    dashStyle: 'shortDash',
                    label: {
                        text: 'RDA',
                        align: 'right',
                        style: {
                            color: '#B73C28'
                        }
                    }
                }]
            },
            credits: {
                enabled: false
            },
            plotOptions: {
                series: {
                    marker: {
                        radius: 6
                    }
                }
            },
            title: {
                text: ''
            },
            legend: {
                enabled: true,
                verticalAlign: 'top'
            },
            chart: {
                animation: false,
                type: 'column',
                spacing: [30, 30, 30, 20]
            }
        }
    }, {
        cell: 'dashboard-col-2',
        connector: {
            id: 'Vitamin'
        },
        type: 'DataGrid',
        editable: true,
        sync: {
            highlight: true,
            visibility: true
        }
    }]
}, true);

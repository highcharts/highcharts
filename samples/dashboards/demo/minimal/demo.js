Dashboards.board('container', {
    dataPool: {
        connectors: [{
            id: 'micro-element',
            type: 'JSON',
            options: {
                firstRowAsNames: false,
                columnNames: ['Food', 'Vitamin A',  'Iron'],
                data: [
                    ['Beef Liver', 6421, 6.5],
                    ['Lamb Liver', 2122, 6.5],
                    ['Cod Liver Oil', 1350, 0.9],
                    ['Mackerel', 388, 1],
                    ['Tuna', 214, 0.6]
                ]
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
                            width: '100%'
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
                                        width: '50%'
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
                                        width: '50%'
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
                    id: 'dashboard-col-0',
                    responsive: {
                        small: {
                            width: '100%'
                        },
                        medium: {
                            width: '50%'
                        },
                        large: {
                            width: '35%'
                        }
                    }
                }, {
                    id: 'dashboard-col-1',
                    responsive: {
                        small: {
                            width: '100%'
                        },
                        medium: {
                            width: '50%'
                        },
                        large: {
                            width: '35%'
                        }
                    }
                }]
            }, {
                cells: [{
                    id: 'dashboard-col-2',
                    height: 323
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
            id: 'micro-element'
        },
        cell: 'dashboard-col-0',
        type: 'Highcharts',
        columnAssignment: {
            Food: 'x',
            'Vitamin A': 'value'
        },
        chartOptions: {
            xAxis: {
                type: 'category',
                accessibility: {
                    description: 'Groceries'
                }
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
            },
            tooltip: {
                valueSuffix: ' mcg',
                stickOnContact: true
            },
            lang: {
                accessibility: {
                    chartContainerLabel: 'Vitamin A in food. Highcharts Interactive Chart.'
                }
            },
            accessibility: {
                description: `The chart is displaying the Vitamin A amount in
                micrograms for some groceries. There is a plotLine demonstrating
                the daily Recommended Dietary Allowance (RDA) of 900
                micrograms.`,
                point: {
                    valueSuffix: ' mcg'
                }
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
            id: 'micro-element'
        },
        type: 'Highcharts',
        columnAssignment: {
            Food: 'x',
            Iron: 'y'
        },
        chartOptions: {
            xAxis: {
                type: 'category',
                accessibility: {
                    description: 'Groceries'
                }
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
            },
            tooltip: {
                valueSuffix: ' mcg',
                stickOnContact: true
            },
            lang: {
                accessibility: {
                    chartContainerLabel: 'Iron in food. Highcharts Interactive Chart.'
                }
            },
            accessibility: {
                description: `The chart is displaying the Iron amount in
                micrograms for some groceries. There is a plotLine demonstrating
                the daily Recommended Dietary Allowance (RDA) of 8
                micrograms.`,
                point: {
                    valueSuffix: ' mcg'
                }
            }
        }
    }, {
        cell: 'dashboard-col-2',
        connector: {
            id: 'micro-element'
        },
        type: 'DataGrid',
        editable: true,
        sync: {
            highlight: true,
            visibility: true
        }
    }]
}, true);

let board = void 0;
let instances = void 0;
let currentInstanceId = void 0;
const pollingCheckbox = document.getElementById('enablePolling');
const KPIOptions = {
    chart: {
        height: 165,
        margin: [0, 0, 0, 0],
        spacing: [0, 0, 0, 0],
        type: 'solidgauge'
    },
    yAxis: {
        min: 0,
        max: 100,
        stops: [
            [0.1, '#33A29D'], // green
            [0.5, '#DDDF0D'], // yellow
            [0.9, '#DF5353'] // red
        ]
    },
    pane: {
        background: {
            innerRadius: '80%',
            outerRadius: '100%'
        }
    },
    accessibility: {
        typeDescription: 'The gauge chart with 1 data point.'
    }
};
const chartConnectorOptions = {
    firstRowAsNames: false,
    columnNames: ['timestamp', 'readOpt', 'writeOpt', 'networkIn', 'networkOut', 'cpuUtilization'],
    beforeParse: function (data) {
        const currentInstance = data.find(
            instance => instance.InstanceId === currentInstanceId
        ) || data;

        return currentInstance.Details.map(
            el => el
        );
    }
};

const instancesDetailsConnectorOptions = {
    firstRowAsNames: false,
    orientantion: 'columns',
    columnNames: ['index', 'CPUUtilization', 'MemoryUsage', 'DiskSizeGB', 'DiskUsedGB', 'DiskFreeGB', 'MediaGB', 'RootGB', 'Documents', 'Downloads'],
    beforeParse: function (data) {
        const currentInstance = data.find(
            instance => instance.InstanceId === currentInstanceId
        ) || data;
        const diskSpace = currentInstance.DiskSpace.RootDisk;
        return [
            [
                0, // display one record on chart KPI / disk
                currentInstance.CPUUtilization,
                currentInstance.MemoryUsage,
                diskSpace.SizeGB,
                diskSpace.UsedGB,
                diskSpace.FreeGB,
                diskSpace.MediaGB,
                diskSpace.RootGB,
                diskSpace.Documents,
                diskSpace.Downloads
            ]
        ];
    }
};

Highcharts.setOptions({
    credits: {
        enabled: false
    },
    title: {
        text: ''
    }
});

pollingCheckbox.onchange = async e => {

    // charts data
    board.dataPool.setConnectorOptions({
        id: 'charts',
        type: 'JSON',
        options: {
            ...chartConnectorOptions,
            enablePolling: e.target.checked,
            dataRefreshRate: 2,
            dataUrl: 'https://demo-live-data.highcharts.com/instance-details.json'
        }
    });

    // KPI instances data
    board.dataPool.setConnectorOptions({
        id: 'instanceDetails',
        type: 'JSON',
        options: {
            ...instancesDetailsConnectorOptions,
            enablePolling: e.target.checked,
            dataRefreshRate: 2,
            dataUrl: 'https://demo-live-data.highcharts.com/instances.json'
        }
    });

    const chartConnector = await board.dataPool.getConnector('charts');
    const instanceDetailsConnector = await board.dataPool.getConnector('instanceDetails');

    // update connector and rerender component
    board.mountedComponents.forEach(mComp => {
        const connectorId = mComp.component.options?.connector?.id;
        if (connectorId) {
            if (connectorId === 'charts') {
                mComp.component.setConnector(chartConnector);
            } else if (
                connectorId === 'instanceDetails' &&
                mComp.cell.id !== 'disk-usage'
            ) {
                mComp.component.setConnector(instanceDetailsConnector);
            }
            mComp.component.render();
        }
    });
};

const setupDashboard = instanceId => {
    const instance = instances.find(
        instance => instance.InstanceId === instanceId
    ) || instances[0];

    // for polling option
    currentInstanceId = instance.InstanceId;

    board = Dashboards.board('container', {
        dataPool: {
            connectors: [{
                id: 'instanceDetails',
                type: 'JSON',
                options: {
                    ...instancesDetailsConnectorOptions,
                    data: instance
                }
            }, {
                id: 'charts',
                type: 'JSON',
                options: {
                    ...chartConnectorOptions,
                    data: instance
                }
            }, {
                id: 'instances',
                type: 'JSON',
                options: {
                    firstRowAsNames: false,
                    data: instances
                }
            }]
        },
        gui: {
            layouts: [{
                rows: [{
                    id: 'instance-details',
                    cells: [{
                        id: 'instance',
                        responsive: {
                            small: {
                                width: '100%'
                            },
                            medium: {
                                width: '50%'
                            },
                            large: {
                                width: '25%'
                            }
                        }
                    }, {
                        id: 'zone',
                        responsive: {
                            small: {
                                width: '100%'
                            },
                            medium: {
                                width: '50%'
                            },
                            large: {
                                width: '25%'
                            }
                        }
                    }, {
                        id: 'ami',
                        responsive: {
                            small: {
                                width: '100%'
                            },
                            medium: {
                                width: '50%'
                            },
                            large: {
                                width: '25%'
                            }
                        }
                    }, {
                        id: 'os',
                        responsive: {
                            small: {
                                width: '100%'
                            },
                            medium: {
                                width: '50%'
                            },
                            large: {
                                width: '25%'
                            }
                        }
                    }]
                }, {
                    cells: [{
                        height: 400,
                        layout: {
                            rows: [{
                                cells: [{
                                    id: 'cpu'
                                }, {
                                    id: 'memory'
                                }]
                            }, {
                                cells: [{
                                    id: 'health'
                                }, {
                                    id: 'disk'
                                }]
                            }]
                        },
                        responsive: {
                            small: {
                                width: '100%'
                            },
                            medium: {
                                width: '100%'
                            },
                            large: {
                                width: '50%'
                            }
                        }
                    }, {
                        id: 'disk-usage',
                        height: 400,
                        responsive: {
                            small: {
                                width: '100%'
                            },
                            medium: {
                                width: '100%'
                            },
                            large: {
                                width: '50%'
                            }
                        }
                    }]
                }, {
                    cells: [{
                        id: 'instances-table',
                        responsive: {
                            small: {
                                width: '100%'
                            },
                            medium: {
                                width: '100%'
                            },
                            large: {
                                width: '50%'
                            }
                        }
                    }, {
                        id: 'cpu-utilization',
                        responsive: {
                            small: {
                                width: '100%'
                            },
                            medium: {
                                width: '100%'
                            },
                            large: {
                                width: '50%'
                            }
                        }
                    }]
                }, {
                    cells: [{
                        id: 'network-opt',
                        height: 300,
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
                        }
                    }, {
                        id: 'disk-opt',
                        height: 300,
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
                        }
                    }]
                }]
            }]
        },
        components: [{
            cell: 'instance',
            type: 'HTML',
            title: 'Instance type:',
            elements: [{
                tagName: 'span'
            }, {
                tagName: 'p',
                textContent: instance.InstanceType
            }]
        }, {
            cell: 'zone',
            type: 'HTML',
            title: 'Zone:',
            elements: [{
                tagName: 'span'
            }, {
                tagName: 'p',
                textContent: instance.Zone
            }]
        }, {
            cell: 'ami',
            type: 'HTML',
            title: 'AMI:',
            elements: [{
                tagName: 'span'
            }, {
                tagName: 'p',
                textContent: instance.AMI
            }]
        }, {
            cell: 'os',
            type: 'HTML',
            title: 'OS:',
            elements: [{
                tagName: 'span'
            }, {
                tagName: 'p',
                textContent: instance.OS
            }]
        }, {
            cell: 'disk-usage',
            title: 'Disk usage',
            type: 'Highcharts',
            connector: {
                id: 'instanceDetails'
            },
            columnAssignment: {
                index: 'x',
                MediaGB: 'y',
                RootGB: 'y',
                Documents: 'y',
                Downloads: 'y'
            },
            chartOptions: {
                xAxis: {
                    title: {
                        text: 'Disk categories'
                    },
                    labels: {
                        enabled: false
                    },
                    tickLength: 0,
                    accessibility: {
                        description: 'Disk categories'
                    }
                },
                yAxis: {
                    title: {
                        text: 'GB'
                    },
                    accessibility: {
                        description: 'Gigabytes'
                    }
                },
                chart: {
                    type: 'bar'
                },
                tooltip: {
                    headerFormat: '',
                    valueSuffix: ' Gb'
                },
                lang: {
                    accessibility: {
                        chartContainerLabel: 'Disk usage. Highcharts interactive chart.'
                    }
                },
                accessibility: {
                    description: 'The chart is displaying space on disk'
                }
            }
        },
        {
            cell: 'cpu-utilization',
            title: 'CPU utilization',
            type: 'Highcharts',
            connector: {
                id: 'charts'
            },
            columnAssignment: {
                timestamp: 'x',
                cpuUtilization: 'y'
            },
            sync: {
                highlight: true
            },
            chartOptions: {
                chart: {
                    type: 'spline'
                },
                series: [{
                    name: 'cpuUtilization'
                }],
                xAxis: {
                    type: 'datetime',
                    accessibility: {
                        description: 'Days'
                    }
                },
                yAxis: {
                    min: 0,
                    max: 100,
                    title: {
                        text: 'Percents'
                    },
                    accessibility: {
                        description: 'Percents'
                    }
                },
                tooltip: {
                    valueSuffix: '%'
                },
                accessibility: {
                    description: 'The chart is displaying CPU usage',
                    point: {
                        valueDescriptionFormat: 'percents'
                    }
                }
            }
        },
        {
            cell: 'cpu',
            type: 'KPI',
            connector: {
                id: 'instanceDetails'
            },
            columnName: 'CPUUtilization',
            chartOptions: {
                ...KPIOptions,
                plotOptions: {
                    series: {
                        className: 'highcharts-live-kpi',
                        dataLabels: {
                            format: '<div style="text-align:center; margin-top: -20px">' +
                            '<div style="font-size:1.2em;">{y}%</div>' +
                            '<div style="font-size:14px; opacity:0.4; text-align: center;">CPU</div>' +
                            '</div>',
                            useHTML: true
                        }
                    }
                },
                series: [{
                    name: 'CPU utilization',
                    innerRadius: '80%',
                    data: [{
                        colorIndex: '100'
                    }],
                    radius: '100%'
                }],
                xAxis: {
                    accessibility: {
                        description: 'Days'
                    }
                },
                lang: {
                    accessibility: {
                        chartContainerLabel: 'CPU usage. Highcharts interactive chart.'
                    }
                },
                tooltip: {
                    valueSuffix: '%'
                }
            }
        }, {
            cell: 'memory',
            type: 'KPI',
            connector: {
                id: 'instanceDetails'
            },
            columnName: 'MemoryUsage',
            chartOptions: {
                ...KPIOptions,
                yAxis: {
                    min: 0,
                    max: 2048,
                    stops: [
                        [0.1, '#33A29D'], // green
                        [0.5, '#DDDF0D'], // yellow
                        [0.9, '#DF5353'] // red
                    ]
                },
                plotOptions: {
                    series: {
                        className: 'highcharts-live-kpi',
                        dataLabels: {
                            format: '<div style="text-align:center; margin-top: -20px">' +
                            '<div style="font-size:1.2em;">{y} MB</div>' +
                            '<div style="font-size:14px; opacity:0.4; text-align: center;">Memory</div>' +
                            '</div>',
                            useHTML: true
                        }
                    }
                },
                series: [{
                    name: 'Memory usage',
                    innerRadius: '80%',
                    data: [{
                        colorIndex: '100'
                    }],
                    radius: '100%'
                }],
                lang: {
                    accessibility: {
                        chartContainerLabel: 'Memory usage. Highcharts interactive chart.'
                    }
                },
                tooltip: {
                    valueSuffix: ' MB'
                }
            }
        },
        {
            cell: 'health',
            type: 'HTML',
            class: 'health-indicator',
            elements: [{
                tagName: 'div',
                class: 'health-wrapper highcharts-' + instance.HealthIndicator + '-icon',
                attributes: {
                    'aria-label': 'Health: ' + instance.HealthIndicator,
                    role: 'img'
                }
            }, {
                tagName: 'div',
                class: 'health-title',
                textContent: 'Health'
            }]
        },
        {
            cell: 'disk',
            type: 'KPI',
            connector: {
                id: 'instanceDetails'
            },
            columnName: 'DiskUsedGB',
            chartOptions: {
                ...KPIOptions,
                plotOptions: {
                    series: {
                        dataLabels: {
                            format: '<div style="text-align:center; margin-top: -20px">' +
                            '<div style="font-size:1.2em;">{y} GB</div>' +
                            '<div style="font-size:14px; opacity:0.4; text-align: center;">Disk space</div>' +
                            '</div>',
                            useHTML: true
                        }
                    }
                },
                series: [{
                    name: 'Disk usage',
                    innerRadius: '80%',
                    data: [{
                        colorIndex: '100'
                    }],
                    radius: '100%'
                }],
                tooltip: {
                    valueSuffix: ' Gb'
                },
                lang: {
                    accessibility: {
                        chartContainerLabel: 'Disk usage. Highcharts interactive chart.'
                    }
                }
            }
        },
        {
            cell: 'network-opt',
            type: 'Highcharts',
            title: 'Network (bytes)',
            connector: {
                id: 'charts'
            },
            columnAssignment: {
                timestamp: 'x',
                networkIn: 'y',
                networkOut: 'y'
            },
            sync: {
                highlight: true
            },
            chartOptions: {
                chart: {
                    type: 'spline'
                },
                xAxis: {
                    type: 'datetime',
                    accessibility: {
                        description: 'Days'
                    }
                },
                yAxis: {
                    title: {
                        text: 'Bytes'
                    },
                    accessibility: {
                        description: 'Bytes'
                    }
                },
                tooltip: {
                    valueDecimals: 0,
                    valueSuffix: ' bytes'
                },
                accessibility: {
                    description: `The chart is displaying amount of in and out
                                network operations`,
                    point: {
                        valueDescriptionFormat: 'bytes'
                    }
                }
            }
        },
        {
            cell: 'disk-opt',
            type: 'Highcharts',
            title: 'Disk operations',
            connector: {
                id: 'charts'
            },
            columnAssignment: {
                timestamp: 'x',
                writeOpt: 'y',
                readOpt: 'y'
            },
            sync: {
                highlight: true
            },
            chartOptions: {
                chart: {
                    type: 'column'
                },
                xAxis: {
                    type: 'datetime',
                    accessibility: {
                        description: 'Days'
                    }
                },
                tooltip: {
                    valueDecimals: 0,
                    valueSuffix: ' operations'
                },
                yAxis: {
                    title: {
                        text: 'Operations'
                    },
                    accessibility: {
                        description: 'Operations'
                    }
                },
                accessibility: {
                    description: `The chart is displaying amount of in and out
                                operations on disk`,
                    point: {
                        valueDescriptionFormat: 'operations'
                    }
                }
            }
        },
        {
            cell: 'instances-table',
            type: 'DataGrid',
            title: 'Instances',
            visibleColumns: ['InstanceId', 'InstanceType', 'PublicIpAddress', 'State', 'HealthIndicator'],
            dataGridOptions: {
                editable: false,
                columns: {
                    InstanceId: {
                        headerFormat: 'ID'
                    },
                    InstanceType: {
                        headerFormat: 'Type'
                    },
                    PublicIpAddress: {
                        headerFormat: 'Public IP'
                    },
                    HealthIndicator: {
                        headerFormat: 'Health'
                    }

                },
                events: {
                    row: {
                        click: function (e) {
                            board.destroy();
                            setupDashboard(
                                e.target.parentNode.childNodes[0].innerText
                            );
                        }
                    }
                }
            },
            connector: {
                id: 'instances'
            },
            events: {
                mount: function () {
                    setTimeout(() => {
                        const currentRow =
                            document.querySelector('[data-original-data="' + instance.InstanceId + '"]').parentNode;
                        currentRow.classList.add('current');
                    }, 1);
                }
            }
        }]
    });
};

// Init
(async () => {
    // load init list of intances
    instances = await fetch(
        'https://demo-live-data.highcharts.com/instances.json'
    ).then(response => response.json());

    setupDashboard();
})();

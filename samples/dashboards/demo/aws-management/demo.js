let board = void 0;
const pollingCheckbox = document.getElementById('enablePolling');

pollingCheckbox.onchange = () => {
    // need to be tested, when back-end will be ready
    board.dataPool.setConnectorOptions({
        enablePolling: true
    });
};

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

Highcharts.setOptions({
    credits: {
        enabled: false
    },
    title: {
        text: ''
    }
});

const instances = [{
    InstanceId: 'i-0abcdef1234567890',
    InstanceType: 't2.micro',
    Zone: 'eu-west-2b',
    AMI: 'ami-0123456',
    OS: 'Amazon Linux',
    State: 'running',
    PrivateIpAddress: '10.0.1.101',
    PublicIpAddress: '54.123.45.67',
    CPUUtilization: 5,
    MemoryUsage: 512,
    DiskSpace: {
        RootDisk: {
            SizeGB: 30,
            UsedGB: 15,
            FreeGB: 15,
            MediaGB: 5,
            RootGB: 10,
            Documents: 10,
            Downloads: 5
        }
    },
    Details: [{
        timestamp: 1640995200000,
        readOpt: 150,
        writeOpt: 80,
        networkIn: 200,
        networkOut: 180,
        cpuUtilization: 30.5
    }, {
        timestamp: 1640998800000,
        readOpt: 120,
        writeOpt: 90,
        networkIn: 180,
        networkOut: 160,
        cpuUtilization: 35.2
    }, {
        timestamp: 1641002400000,
        readOpt: 180,
        writeOpt: 75,
        networkIn: 220,
        networkOut: 200,
        cpuUtilization: 28.8
    }, {
        timestamp: 1641006000000,
        readOpt: 130,
        writeOpt: 85,
        networkIn: 190,
        networkOut: 170,
        cpuUtilization: 32.1
    }, {
        timestamp: 1641009600000,
        readOpt: 160,
        writeOpt: 70,
        networkIn: 210,
        networkOut: 190,
        cpuUtilization: 27.3
    }, {
        timestamp: 1641013200000,
        readOpt: 140,
        writeOpt: 95,
        networkIn: 200,
        networkOut: 180,
        cpuUtilization: 31.7
    }, {
        timestamp: 1641016800000,
        readOpt: 170,
        writeOpt: 78,
        networkIn: 230,
        networkOut: 210,
        cpuUtilization: 29.4
    }, {
        timestamp: 1641020400000,
        readOpt: 110,
        writeOpt: 88,
        networkIn: 170,
        networkOut: 150,
        cpuUtilization: 34.2
    }, {
        timestamp: 1641024000000,
        readOpt: 155,
        writeOpt: 72,
        networkIn: 205,
        networkOut: 185,
        cpuUtilization: 26.8
    }, {
        timestamp: 1641027600000,
        readOpt: 125,
        writeOpt: 82,
        networkIn: 185,
        networkOut: 165,
        cpuUtilization: 5.0
    }],
    HealthIndicator: 'OK'
}, {
    InstanceId: 'i-1a2b3c4d5e6f78901',
    InstanceType: 't3.small',
    Zone: 'eu-centra-1a',
    AMI: 'ami-043918s',
    OS: 'Amazon Windows',
    State: 'stopped',
    PrivateIpAddress: '10.0.1.102',
    PublicIpAddress: '354.123.45.67',
    CPUUtilization: 65,
    MemoryUsage: 256,
    DiskSpace: {
        RootDisk: {
            SizeGB: 20,
            UsedGB: 10,
            FreeGB: 10,
            MediaGB: 5,
            RootGB: 10,
            Documents: 2,
            Downloads: 3
        }
    },
    Details: [{
        timestamp: 1640995200000,
        readOpt: 15,
        writeOpt: 80,
        networkIn: 200,
        networkOut: 180,
        cpuUtilization: 30.5
    }, {
        timestamp: 1640998800000,
        readOpt: 12,
        writeOpt: 90,
        networkIn: 180,
        networkOut: 160,
        cpuUtilization: 35.2
    }, {
        timestamp: 1641002400000,
        readOpt: 180,
        writeOpt: 5,
        networkIn: 120,
        networkOut: 100,
        cpuUtilization: 28.8
    }, {
        timestamp: 1641006000000,
        readOpt: 130,
        writeOpt: 85,
        networkIn: 190,
        networkOut: 170,
        cpuUtilization: 32.1
    }, {
        timestamp: 1641009600000,
        readOpt: 160,
        writeOpt: 70,
        networkIn: 210,
        networkOut: 190,
        cpuUtilization: 27.3
    }, {
        timestamp: 1641013200000,
        readOpt: 140,
        writeOpt: 95,
        networkIn: 20,
        networkOut: 18,
        cpuUtilization: 31.7
    }, {
        timestamp: 1641016800000,
        readOpt: 170,
        writeOpt: 78,
        networkIn: 23,
        networkOut: 21,
        cpuUtilization: 29.4
    }, {
        timestamp: 1641020400000,
        readOpt: 11,
        writeOpt: 8,
        networkIn: 170,
        networkOut: 150,
        cpuUtilization: 34.2
    }, {
        timestamp: 1641024000000,
        readOpt: 155,
        writeOpt: 72,
        networkIn: 205,
        networkOut: 185,
        cpuUtilization: 26.8
    }, {
        timestamp: 1641027600000,
        readOpt: 125,
        writeOpt: 82,
        networkIn: 125,
        networkOut: 15,
        cpuUtilization: 65
    }],
    HealthIndicator: 'Warning'
}, {
    InstanceId: 'i-9876543210abcdef0',
    InstanceType: 'm5.large',
    Zone: 'eu-east-1c',
    AMI: 'ami-030129s',
    OS: 'Amazon Ubuntu',
    State: 'running',
    PrivateIpAddress: '10.0.1.103',
    PublicIpAddress: '54.321.67.89',
    CPUUtilization: 95,
    MemoryUsage: 2048,
    DiskSpace: {
        RootDisk: {
            SizeGB: 50,
            UsedGB: 15,
            FreeGB: 35,
            MediaGB: 15,
            RootGB: 20,
            Documents: 5,
            Downloads: 10
        }
    },
    Details: [{
        timestamp: 1672531200000,
        readOpt: 180,
        writeOpt: 70,
        networkIn: 220,
        networkOut: 200,
        cpuUtilization: 25.5
    }, {
        timestamp: 1672534800000,
        readOpt: 130,
        writeOpt: 85,
        networkIn: 190,
        networkOut: 170,
        cpuUtilization: 30.2
    }, {
        timestamp: 1672538400000,
        readOpt: 16,
        writeOpt: 5,
        networkIn: 205,
        networkOut: 80,
        cpuUtilization: 28.8
    }, {
        timestamp: 1672542000000,
        readOpt: 120,
        writeOpt: 95,
        networkIn: 180,
        networkOut: 160,
        cpuUtilization: 35.1
    }, {
        timestamp: 1672545600000,
        readOpt: 14,
        writeOpt: 6,
        networkIn: 10,
        networkOut: 90,
        cpuUtilization: 27.3
    }, {
        timestamp: 1672549200000,
        readOpt: 210,
        writeOpt: 185,
        networkIn: 70,
        networkOut: 150,
        cpuUtilization: 31.7
    }, {
        timestamp: 1672552800000,
        readOpt: 150,
        writeOpt: 78,
        networkIn: 10,
        networkOut: 196,
        cpuUtilization: 29.4
    }, {
        timestamp: 1672556400000,
        readOpt: 100,
        writeOpt: 92,
        networkIn: 10,
        networkOut: 143,
        cpuUtilization: 33.2
    }, {
        timestamp: 1672560000000,
        readOpt: 145,
        writeOpt: 68,
        networkIn: 200,
        networkOut: 180,
        cpuUtilization: 26.8
    }, {
        timestamp: 1672563600000,
        readOpt: 125,
        writeOpt: 80,
        networkIn: 185,
        networkOut: 16,
        cpuUtilization: 100
    }],
    HealthIndicator: 'Critical'
}];

const setupDashboard = instance => {
    board = Dashboards.board('container', {
        dataPool: {
            connectors: [{
                id: 'instanceDetails',
                type: 'JSON',
                options: {
                    firstRowAsNames: false,
                    orientantion: 'columns',
                    columnNames: ['CPUUtilization', 'MemoryUsage', 'DiskSizeGB', 'DiskUsedGB', 'DiskFreeGB', 'MediaGB', 'RootGB', 'Documents', 'Downloads'],
                    beforeParse: function (data) {
                        const diskSpace = data.DiskSpace.RootDisk;
                        return [
                            [
                                data.CPUUtilization,
                                data.MemoryUsage,
                                diskSpace.SizeGB,
                                diskSpace.UsedGB,
                                diskSpace.FreeGB,
                                diskSpace.MediaGB,
                                diskSpace.RootGB,
                                diskSpace.Documents,
                                diskSpace.Downloads
                            ]
                        ];
                    },
                    data: instance
                }
            }, {
                id: 'charts',
                type: 'JSON',
                options: {
                    firstRowAsNames: false,
                    columnNames: ['timestamp', 'readOpt', 'writeOpt', 'networkIn', 'networkOut', 'cpuUtilization'],
                    beforeParse: function () {
                        return instance.Details.map(el => Object.values(el));
                    },
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
            chartOptions: {
                series: [{
                    type: 'spline',
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
                                instances.find(instance => instance.InstanceId === e.target.parentNode.childNodes[0].innerText) || instances[0]
                            );

                        }
                    }
                }
            },
            connector: {
                id: 'instances'
            },
            events: {
                mount: function() {
                    setTimeout(() => {
                        const currentRow = document.querySelector('[data-original-data="' + instance.InstanceId + '"]').parentNode;
                        currentRow.classList.add('current');
                    }, 1);
                }
            }
        }]
    });
};

// Init
setupDashboard(instances[0]);

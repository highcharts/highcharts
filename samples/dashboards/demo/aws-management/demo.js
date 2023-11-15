const data = [{
    "InstanceId": "i-0abcdef1234567890",
    "InstanceType": "t2.micro",
    "State": "running",
    "PrivateIpAddress": "10.0.1.101",
    "PublicIpAddress": "54.123.45.67",
    "CPUUtilization": 20.5,
    "MemoryUsage": 512,
    "DiskSpace": {
        "RootDisk": {
            "SizeGB": 30,
            "UsedGB": 15,
            "FreeGB": 15
        },
        "AdditionalDisks": [{
            "Name": "ephemeral0",
            "SizeGB": 100,
            "UsedGB": 50,
            "FreeGB": 50
        }]
    },
    "DiskOperations": {
        "ReadOps": 1500,
        "WriteOps": 800
    },
    "Network": {
        "ReceivedBytes": 102400,
        "TransmittedBytes": 204800
    },
    "HealthIndicator": "OK"
},
{
    "InstanceId": "i-1a2b3c4d5e6f78901",
    "InstanceType": "t3.small",
    "State": "stopped",
    "PrivateIpAddress": "10.0.1.102",
    "PublicIpAddress": "",
    "CPUUtilization": 0,
    "MemoryUsage": 256,
    "DiskSpace": {
        "RootDisk": {
            "SizeGB": 20,
            "UsedGB": 10,
            "FreeGB": 10
        }
    },
    "DiskOperations": {
        "ReadOps": 500,
        "WriteOps": 300
    },
    "Network": {
        "ReceivedBytes": 51200,
        "TransmittedBytes": 102400
    },
    "HealthIndicator": "Warning"
},
{
    "InstanceId": "i-9876543210abcdef0",
    "InstanceType": "m5.large",
    "State": "running",
    "PrivateIpAddress": "10.0.1.103",
    "PublicIpAddress": "54.321.67.89",
    "CPUUtilization": 45.2,
    "MemoryUsage": 2048,
    "DiskSpace": {
        "RootDisk": {
            "SizeGB": 50,
            "UsedGB": 25,
            "FreeGB": 25
        },
        "AdditionalDisks": []
    },
    "DiskOperations": {
        "ReadOps": 2500,
        "WriteOps": 1200
    },
    "Network": {
        "ReceivedBytes": 307200,
        "TransmittedBytes": 409600
    },
    "HealthIndicator": "Critical"
}
];


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
    }
};

// live generator
const generateLivePoint = (chart, addPoint) => {
    const newVal = Math.abs(Math.round((Math.random()) * 100));

    if (addPoint) {
        chart.series[0].addPoint(newVal, false, true);
        if (chart.series.length > 1) {
            chart.series[1].addPoint(
                newVal + (Math.random() * 10),
                false,
                true
            );
        }
        chart.redraw();
    } else {
        chart.series[0].points[0].update(newVal);
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

Dashboards.board('container', {
    dataPool: {
        connectors: [{
            id: 'instances',
            type: 'JSON',
            options: {
                firstRowAsNames: false,
                columnNames: ['id', 'name', 'type', 'public IP', 'state', 'health'],
                data: [
                    ['rsf934fds', 'Blue', 't3.micro', '54.123.45.61', 'running', 'critical'],
                    ['f0efnakr', 'Red', 't3.small', '54.123.45.62', 'running', 'ok'],
                    ['mfaiks12', 'White', 't3.medium', '54.123.45.63', 'running', 'warning'],
                    ['15fqmfk', 'Green', 't3.xlarge', '54.123.45.64', 'running', 'ok']
                ]
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
            tagName: 'h2',
            textContent: 't3.xlarge'
        }]
    }, {
        cell: 'zone',
        type: 'HTML',
        title: 'Zone:',
        elements: [{
            tagName: 'h2',
            textContent: 'eu-west-2b'
        }]
    }, {
        cell: 'ami',
        type: 'HTML',
        title: 'AMI:',
        elements: [{
            tagName: 'h2',
            textContent: 'ami-0123456'
        }]
    }, {
        cell: 'os',
        type: 'HTML',
        title: 'OS:',
        elements: [{
            tagName: 'h2',
            textContent: 'Amazon Linux'
        }]
    }, {
        cell: 'disk-usage',
        title: 'Disk usage',
        type: 'Highcharts',
        chartOptions: {
            xAxis: {
                categories: ['system files', 'media', 'documents', 'downloads']
            },
            series: [{
                type: 'bar',
                data: [1, 2, 3, 1]
            }]
        }
    }, {
        cell: 'cpu-utilization',
        title: 'CPU utilization',
        type: 'Highcharts',
        chartOptions: {
            chart: {
                events: {
                    load: function () {
                        const chart = this;
                        setInterval(() => {
                            generateLivePoint(chart, true);
                        }, 2000);
                    }
                }
            },
            series: [{
                type: 'spline',
                data: [10, 20, 30, 10, 30, 10, 30]
            }]
        }
    }, {
        cell: 'cpu',
        type: 'KPI',
        chartOptions: {
            ...KPIOptions,
            chart: {
                ...KPIOptions.chart,
                events: {
                    load: function () {
                        const chart = this;
                        setInterval(() => {
                            generateLivePoint(chart);
                        }, 2000);
                    }
                }
            },
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
                data: [{
                    y: 10,
                    colorIndex: '100' // workaround for live KPI
                }],
                innerRadius: '80%',
                radius: '100%'
            }]
        }
    }, {
        cell: 'memory',
        type: 'KPI',
        chartOptions: {
            ...KPIOptions,
            chart: {
                ...KPIOptions.chart,
                events: {
                    load: function () {
                        const chart = this;
                        setInterval(() => {
                            generateLivePoint(chart);
                        }, 2000);
                    }
                }
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
                data: [{
                    y: 54,
                    colorIndex: '100' // workaround for live KPI
                }],
                innerRadius: '80%',
                radius: '100%'
            }]
        }
    }, {
        cell: 'health',
        type: 'HTML',
        class: 'health-indicator',
        elements: [{
            tagName: 'div',
            class: 'health-wrapper highcharts-ok-icon'
        }, {
            tagName: 'div',
            class: 'health-title',
            textContent: 'Health'
        }]
    }, {
        cell: 'disk',
        type: 'KPI',
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
                data: [53],
                innerRadius: '80%',
                radius: '100%'
            }]
        }
    }, {
        cell: 'network-opt',
        type: 'Highcharts',
        title: 'Network (bytes)',
        chartOptions: {
            chart: {
                type: 'spline',
                events: {
                    load: function () {
                        const chart = this;
                        setInterval(() => {
                            generateLivePoint(chart, true);
                        }, 2000);
                    }
                }
            },
            series: [{
                name: 'Network in',
                data: [10, 20, 30, 10, 30, 10, 30]
            }, {
                name: 'Network out',
                data: [60, 40, 20, 20, 30, 40, 50]
            }]
        }
    }, {
        cell: 'disk-opt',
        type: 'Highcharts',
        title: 'Disk operations',
        chartOptions: {
            chart: {
                type: 'column',
                events: {
                    load: function () {
                        const chart = this;
                        setInterval(() => {
                            generateLivePoint(chart, true);
                        }, 2000);
                    }
                }
            },
            series: [{
                name: 'Read operation',
                data: [10, 20, 30, 10, 30, 10, 30]
            }, {
                name: 'Write operation',
                data: [50, 30, 10, 20, 30, 40, 50]
            }]
        }
    }, {
        cell: 'instances-table',
        type: 'DataGrid',
        title: 'Instances',
        dataGridOptions: {
            editable: false
        },
        connector: {
            id: 'instances'
        }
    }]
});

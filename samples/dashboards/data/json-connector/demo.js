const data = [{
    InstanceId: 'i-0abcdef1234567890',
    InstanceType: 't2.micro',
    State: 'running',
    PrivateIpAddress: '10.0.1.101',
    PublicIpAddress: '54.123.45.67',
    CPUUtilization: 20.5,
    MemoryUsage: 512,
    DiskSpace: {
        RootDisk: {
            SizeGB: 30,
            UsedGB: 15,
            FreeGB: 15
        }
    },
    DiskOperations: [{
        ReadOps: 1500,
        WriteOps: 800
    }]
}, {
    InstanceId: 'i-1a2b3c4d5e6f78901',
    InstanceType: 't3.small',
    State: 'stopped',
    PrivateIpAddress: '10.0.1.102',
    PublicIpAddress: '',
    CPUUtilization: 0,
    MemoryUsage: 256,
    DiskSpace: {
        RootDisk: {
            SizeGB: 20,
            UsedGB: 10,
            FreeGB: 10
        }
    },
    DiskOperations: [{
        timestamp: 1637037600000,
        ReadOps: 500,
        WriteOps: 300
    }]
}, {
    InstanceId: 'i-9876543210abcdef0',
    InstanceType: 'm5.large',
    State: 'running',
    PrivateIpAddress: '10.0.1.103',
    PublicIpAddress: '54.321.67.89',
    CPUUtilization: 45.2,
    MemoryUsage: 2048,
    DiskSpace: {
        RootDisk: {
            SizeGB: 50,
            UsedGB: 25,
            FreeGB: 25
        }
    },
    DiskOperations: [{
        timestamp: 1637037600000,
        ReadOps: 400,
        WriteOps: 100
    }]
}];

async function setupBoard() {
    Dashboards.board('container', {
        dataPool: {
            connectors: [{
                id: 'micro-element',
                type: 'JSON',
                firstRowAsNames: false,
                columnIds: {
                    InstanceType: ['InstanceType'],
                    DiskSpace: ['DiskSpace', 'RootDisk', 'SizeGB'],
                    ReadOps: ['DiskOperations', 0, 'ReadOps']
                },
                data
            }]
        },
        gui: {
            layouts: [{
                rows: [{
                    cells: [{
                        id: 'dashboard-col-1'
                    }, {
                        id: 'dashboard-col-2'
                    }]
                }]
            }]
        },
        components: [{
            renderTo: 'dashboard-col-1',
            connector: {
                id: 'micro-element',
                columnAssignment: [{
                    seriesId: 'ReadOps',
                    data: ['InstanceType', 'ReadOps']
                }, {
                    seriesId: 'DiskSpace',
                    data: ['InstanceType', 'DiskSpace']
                }]
            },
            type: 'Highcharts',
            chartOptions: {
                chart: {
                    type: 'column'
                },
                xAxis: {
                    type: 'category'
                }
            }
        }]
    }, true);
}

setupBoard();

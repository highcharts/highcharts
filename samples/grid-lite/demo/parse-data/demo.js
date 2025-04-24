const initGrid = data => {
    Grid.grid('container', {
        dataTable: {
            columns: data
        },
        rendering: {
            columns: {
                distribution: 'mixed'
            }
        },
        columns: [
            {
                id: 'InstanceId',
                header: {
                    format: 'ID'
                }
            },
            {
                id: 'InstanceType',
                header: {
                    format: 'Type'
                }
            },
            {
                id: 'PublicIpAddress',
                header: {
                    format: 'Public IP'
                }
            },
            {
                id: 'State'
            },
            {
                id: 'DiskSpace',
                header: {
                    format: 'Disk used / size'
                },
                cells: {
                    formatter: function () {
                        const disk = this.value.RootDisk;
                        return `${disk.UsedGB}GB / ${disk.SizeGB}GB`;
                    }
                }
            },
            {
                id: 'HealthIndicator',
                header: {
                    format: 'Health'
                },
                width: '100px',
                useHTML: true,
                cells: {
                    formatter: function () {
                        const val = this.value;
                        return `<img
                            src='https://www.highcharts.com/samples/graphics/dashboards/cloud-monitoring/${val.toLowerCase()}-ico.${val === 'Critical' ? 'png' : 'svg'}'
                            alt='${val}'
                        />`;
                    }
                }
            }
        ]
    });
};

// Init
(async () => {
    const data = {};

    // Load data
    const instances = await fetch(
        'https://demo-live-data.highcharts.com/instances.json'
    ).then(response => response.json());

    // Fields that we would like to extract from data
    const fields = [
        'InstanceId',
        'InstanceType',
        'PublicIpAddress',
        'State',
        'DiskSpace',
        'HealthIndicator'
    ];

    // Parse data
    instances.forEach(instance => {
        fields.forEach(field => {
            if (!data[field]) {
                data[field] = [];
            }

            data[field].push(instance[field]);
        });
    });

    // Init Grid
    initGrid(data);
})();

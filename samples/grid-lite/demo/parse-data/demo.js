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
        header: [{
            columnId: 'InstanceId',
            format: 'ID'
        }, {
            columnId: 'InstanceType',
            format: 'Type'
        }, {
            columnId: 'PublicIpAddress',
            format: 'Public IP'
        },
        'State',
        {
            columnId: 'UsedGB',
            format: 'Disk used / size'
        }, {
            columnId: 'HealthIndicator',
            format: 'Health'
        }],
        columns: [
            {
                id: 'UsedGB',
                cells: {
                    formatter: function () {
                        return `${this.value}GB / ${this.row.data.SizeGB}GB`;
                    }
                }
            },
            {
                id: 'HealthIndicator',
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
        'DiskSpace.RootDisk.UsedGB',
        'DiskSpace.RootDisk.SizeGB',
        'HealthIndicator'
    ];

    // Parse data
    instances.forEach(instance => {
        fields.forEach(field => {
            const keys = field.split('.');
            const fieldName = keys[keys.length - 1];
            let current = instance;

            if (!data[fieldName]) {
                data[fieldName] = [];
            }

            for (let i = 0; i < keys.length - 1; i++) {
                if (!(keys[i] in current)) {
                    current[keys[i]] = {};
                }
                current = current[keys[i]];
            }

            data[fieldName].push(current[keys[keys.length - 1]]);
        });
    });

    // Init Grid
    initGrid(data);
})();

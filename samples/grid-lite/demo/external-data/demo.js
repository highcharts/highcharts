const initGrid = data => {
    Grid.grid('container', {
        data: {
            columns: data
        },
        rendering: {
            rows: {
                strictHeights: true
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
        columns: [{
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
            className: 'text-center',
            cells: {
                formatter: function () {
                    const val = this.value;
                    return `<img
                        src='https://www.highcharts.com/samples/graphics/dashboards/cloud-monitoring/${val.toLowerCase()}-ico.svg'
                        alt='${val}'
                    />`;
                }
            }
        }]
    });
};

// Init
(async () => {
    const data = {};

    // Fetch JSON data from external source
    const instances = await fetch(
        'https://demo-live-data.highcharts.com/instances.json'
    )
        .then(response => response.json())
        .catch(err => console.log(err));

    // The properties we would like to extract from the JSON
    const fields = [
        'InstanceId',
        'InstanceType',
        'PublicIpAddress',
        'State',
        'DiskSpace.RootDisk.UsedGB',
        'DiskSpace.RootDisk.SizeGB',
        'HealthIndicator'
    ];

    // Parse the properties to a data format that Grid can consume (https://www.highcharts.com/docs/grid/understanding-grid#datatable)
    (instances || []).forEach(instance => {
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

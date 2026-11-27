Grid.grid('container', {
    data: {
        columns: {
            department: [
                'Engineering', 'Engineering', 'Engineering',
                'Sales', 'Sales', 'Marketing'
            ],
            name: ['Anne', 'Luis', 'Mia', 'Ola', 'Vera', 'Tom'],
            position: [
                'Developer', 'Developer', 'Manager',
                'Executive', 'Manager', 'Specialist'
            ],
            salary: [92000, 87000, 110000, 74000, 98000, 69000]
        }
    },
    rowGrouping: {
        enabled: true,
        groupBy: 'department'
    },
    rendering: {
        rows: {
            expandedLevels: 'all'
        }
    },
    columns: [{
        id: 'name',
        header: {
            format: 'Name'
        },
        cells: {
            format: '<span class="badge">{value}</span>',
            // Group rows have no name, so leave the cell empty
            groupFormat: ''
        }
    }, {
        id: 'position',
        header: {
            format: 'Position'
        }
    }, {
        id: 'salary',
        header: {
            format: 'Salary'
        },
        cells: {
            format: '${value:,.0f}',
            // Group rows show the aggregated total
            groupFormat: 'Total: ${value:,.0f}'
        },
        rowAggregator: 'SUM'
    }]
});

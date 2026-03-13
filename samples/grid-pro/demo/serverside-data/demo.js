const columns = [
    'employeeId', 'firstName', 'lastName', 'department', 'role',
    'hireDate', 'city', 'state'
].join(',');

Grid.grid('container', {
    data: {
        providerType: 'remote',
        dataSource: {
            urlTemplate: 'https://demo-data-server.highstage.dev/data' +
                '?format={format}&dataset=large' +
                '&columnsInclude=' + columns +
                '&page={page}&pageSize={pageSize}' +
                '&filter={filter}&sortBy={sortBy}&sortOrder={sortOrder}'
        },
        idColumn: 'employeeId'
    },
    columnDefaults: {
        sorting: {
            enabled: true
        },
        filtering: {
            enabled: true
        }
    },
    columns: [{
        id: 'employeeId',
        header: {
            format: 'ID'
        },
        width: 90
    }, {
        id: 'firstName',
        header: {
            format: 'First Name'
        }
    }, {
        id: 'lastName',
        header: {
            format: 'Last Name'
        }
    }, {
        id: 'department',
        header: {
            format: 'Department'
        }
    }, {
        id: 'role',
        header: {
            format: 'Role'
        }
    }, {
        id: 'hireDate',
        header: {
            format: 'Hire Date'
        },
        cells: {
            formatter: function () {
                if (!this.value) {
                    return '';
                }
                const d = new Date(this.value);
                return d.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                });
            }
        }
    }, {
        id: 'city',
        header: {
            format: 'City'
        }
    }, {
        id: 'state',
        header: {
            format: 'State'
        },
        width: 80
    }],
    pagination: {
        enabled: true,
        pageSize: 10,
        controls: {
            pageSizeSelector: {
                enabled: true,
                options: [5, 10, 20, 50]
            }
        }
    }
});

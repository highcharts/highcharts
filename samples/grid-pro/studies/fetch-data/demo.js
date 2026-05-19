function generateRandomData(rows) {
    const names = ['John', 'Jane', 'Alex', 'Chris', 'Katie', 'Michael'];
    const departments = ['HR', 'Engineering', 'Sales', 'Marketing', 'Finance'];
    const positions = ['Manager', 'Developer', 'Analyst', 'Director'];
    const columns = {
        ID: [],
        Name: [],
        Department: [],
        Position: [],
        Email: []
    };

    for (let i = 0; i < rows; i++) {
        const nameIndex = i < names.length ?
            i : Math.floor(Math.random() * names.length);
        const departmentIndex = Math.floor(Math.random() * departments.length);
        const positionIndex = Math.floor(Math.random() * positions.length);
        const id = i + 1;
        const name = names[nameIndex];
        const department = departments[departmentIndex];
        const position = positions[positionIndex];

        columns.ID.push(id);
        columns.Name.push(name);
        columns.Department.push(department);
        columns.Position.push(position);
        columns.Email.push(`${name.toLowerCase()}@company.com`);
    }

    return columns;
}


Grid.grid('container', {
    data: {
        columns: generateRandomData(10)
    },
    pagination: {
        enabled: true,
        pageSize: 22,
        totalItems: 100,
        controls: {
            pageSizeSelector: { // boolean
                enabled: true,
                options: [10, 20, 50, 100]
            },
            pageInfo: {  // boolean
                enabled: true
            },
            firstLastButtons: {  // boolean
                enabled: true
            },
            previousNextButtons: {  // boolean
                enabled: true
            },
            pageButtons: {  // boolean
                enabled: true,
                count: 5
            }
        },
        events: {
            beforePageChange: function () {
                // Fetch data from server
                const data = generateRandomData(10);

                // Update data table
                this.grid.update({
                    data: {
                        columns: data
                    }
                }, false, true);

                // Refresh pagination state
                this.grid.pagination.updateGridPagination(true);
            },
            afterPageChange: function (e) {
                document.getElementById('afterPageChange').value =
                    e.currentPage;
            },
            beforePageSizeChange: function (e) {
                document.getElementById('beforePageSizeChange').value =
                    e.pageSize;
            },
            afterPageSizeChange: function (e) {
                document.getElementById('afterPageSizeChange').value =
                    e.pageSize;
            }
        }
    }
});

function generateRandomData(rows) {
    const names = ['John', 'Jane', 'Alex', 'Chris', 'Katie', 'Michael'];
    const departments = ['HR', 'Engineering', 'Sales', 'Marketing', 'Finance'];
    const columns = {
        ID: [],
        Name: [],
        Department: []
    };

    for (let i = 0; i < rows; i++) {
        const nameIndex = Math.floor(Math.random() * names.length);
        const departmentIndex = Math.floor(Math.random() * departments.length);
        const id = i + 1;

        columns.ID.push(id);
        columns.Name.push(names[nameIndex]);
        columns.Department.push(departments[departmentIndex]);
    }

    return columns;
}

Grid.grid('container', {
    dataTable: {
        columns: generateRandomData(10)
    },
    pagination: {
        enabled: true,
        itemsPerPage: 6,
        events: {
            beforePageChange: function () {
                console.log('beforePageChange');
            },
            afterPageChange: function () {
                console.log('afterPageChange');
            }
        }
    }
});

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

window.grid = Grid.grid('container', {
    dataTable: {
        columns: generateRandomData(254) // 254 items to match the design
    },
    pagination: {
        enabled: true,
        pageSize: 22,
        controls: {
            pageSizeSelector: {
                enabled: true,
                options: [10, 20, 50, 100]
            },
            pageInfo: true,
            firstLastButtons: true,
            previousNextButtons: true,
            pageButtons: {
                enabled: true,
                count: 5
            }
        }
    }
});

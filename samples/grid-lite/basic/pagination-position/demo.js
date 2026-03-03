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
        const nameIndex = Math.floor(Math.random() * names.length);
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

// Example 1: Bottom pagination (default)
Grid.grid('container', {
    dataTable: {
        columns: generateRandomData(100)
    },
    caption: {
        text: 'Caption: Bottom pagination (default)'
    },
    description: {
        text: 'Description: Bottom pagination (default)'
    },
    pagination: {
        enabled: true,
        position: 'bottom' // default
    }
});

// Example 2: Top pagination
Grid.grid('container-top', {
    dataTable: {
        columns: generateRandomData(100)
    },
    caption: {
        text: 'Caption: Top pagination'
    },
    description: {
        text: 'Description: Top pagination'
    },
    pagination: {
        enabled: true,
        position: 'top'
    }
});

// Example 3: Footer pagination (tfoot)
Grid.grid('container-footer', {
    dataTable: {
        columns: generateRandomData(100)
    },
    caption: {
        text: 'Caption: Footer pagination (tfoot)'
    },
    description: {
        text: 'Description: Footer pagination (tfoot)'
    },
    pagination: {
        enabled: true,
        position: 'footer'
    }
});

// Example 4: Custom container pagination
Grid.grid('container-custom', {
    dataTable: {
        columns: generateRandomData(100)
    },
    caption: {
        text: 'Caption: Custom container pagination'
    },
    description: {
        text: 'Description: Custom container pagination'
    },
    pagination: {
        enabled: true,
        position: '#custom-pagination'
    }
});

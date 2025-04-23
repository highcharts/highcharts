function generateRandomData(rows) {
    const names = ['John', 'Jane', 'Alex', 'Chris', 'Katie', 'Michael'];
    const departments = ['HR', 'Engineering', 'Sales', 'Marketing', 'Finance'];
    const positions = [
        'Manager',
        'Software Developer',
        'Sales Executive',
        'Marketing Specialist',
        'Financial Analyst'
    ];
    const columns = {
        ID: [],
        Name: [],
        Department: [],
        Position: []
    };

    for (let i = 0; i < rows; i++) {
        const nameIndex = Math.floor(Math.random() * names.length);
        const departmentIndex = Math.floor(Math.random() * departments.length);
        const positionIndex = Math.floor(Math.random() * positions.length);
        const id = i + 1;

        columns.ID.push(id);
        columns.Name.push(names[nameIndex]);
        columns.Department.push(departments[departmentIndex]);
        columns.Position.push(positions[positionIndex]);
    }

    columns.ID.unshift('---First row---');
    columns.Name.unshift('---First row---');
    columns.Department.unshift('---First row---');
    columns.Position.unshift('---First row---');

    columns.ID.push('---Last row---');
    columns.Name.push('---Last row---');
    columns.Department.push('---Last row---');
    columns.Position.push('---Last row---');

    return columns;
}

const grid = Grid.grid('container', {
    dataTable: {
        columns: generateRandomData(1000000)
    }
});


setTimeout(() => {
    grid.viewport.scrollToRow(999999);
}, 2000);
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
        Position: [],
        Email: [],
        Phone: []
    };

    for (let i = 0; i < rows; i++) {
        const nameIndex = Math.floor(Math.random() * names.length);
        const departmentIndex = Math.floor(Math.random() * departments.length);
        const positionIndex = Math.floor(Math.random() * positions.length);
        const id = i + 1;
        const email = `${names[nameIndex].toLowerCase()}${id}@example.com`;
        const phone = `123-456-7${Math.floor(Math.random() * 1000)
            .toString()
            .padStart(3, '0')}`;

        columns.ID.push(id);
        columns.Name.push(names[nameIndex]);
        columns.Department.push(departments[departmentIndex]);
        columns.Position.push(positions[positionIndex]);
        columns.Email.push(email);
        columns.Phone.push(phone);
    }

    return columns;
}

DataGrid.dataGrid('container', {
    dataTable: {
        columns: generateRandomData(10000)
    }
});

function generateRandomData(rows, columnCount) {
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

    const baseColumnCount = Object.keys(columns).length;
    const extraCount = Math.max(columnCount - baseColumnCount, 0);
    const extraKeys = [];

    for (let i = 0; i < extraCount; i++) {
        const key = `Column ${i + 1}`;
        columns[key] = [];
        extraKeys.push(key);
    }

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

        for (let j = 0; j < extraKeys.length; j++) {
            columns[extraKeys[j]].push((i + j) % 1000);
        }
    }

    return columns;
}

const data = generateRandomData(10000, 300);

Grid.grid('container', {
    dataTable: {
        columns: data
    },
    rendering: {
        rows: {
            minVisibleRows: 20
        },
        columns: {
            virtualization: true,
            bufferSize: 2
        }
    },
    columns: Object.keys(data).map(id => ({
        id,
        width: 100
    }))
});

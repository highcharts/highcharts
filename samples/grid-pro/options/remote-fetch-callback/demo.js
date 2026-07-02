const requestCountEl = document.getElementById('request-count');
const requestRangeEl = document.getElementById('request-range');

const rows = Array.from({ length: 24 }, (_, i) => ({
    employeeId: 'EMP-' + String(i + 1).padStart(3, '0'),
    firstName: [
        'Liam', 'Emma', 'Noah', 'Olivia', 'Lucas', 'Sophia'
    ][i % 6],
    department: ['Sales', 'Finance', 'Support', 'Engineering'][i % 4]
}));

let requestCount = 0;

function rowsToColumns(chunk) {
    return {
        employeeId: chunk.map(row => row.employeeId),
        firstName: chunk.map(row => row.firstName),
        department: chunk.map(row => row.department)
    };
}

Grid.grid('container', {
    data: {
        providerType: 'remote',
        fetchCallback: async function (query, offset, limit) {
            void query;

            requestCount += 1;
            requestCountEl.textContent = String(requestCount);
            requestRangeEl.textContent =
                offset + ' - ' + (Math.min(offset + limit, rows.length) - 1);

            await new Promise(resolve => {
                setTimeout(resolve, 150);
            });

            const chunk = rows.slice(offset, offset + limit);

            return {
                columns: rowsToColumns(chunk),
                totalRowCount: rows.length,
                rowIds: chunk.map(row => row.employeeId)
            };
        }
    },
    pagination: {
        enabled: true,
        pageSize: 5
    },
    columns: [{
        id: 'employeeId',
        width: 100
    }, {
        id: 'firstName',
        header: {
            format: 'First name'
        }
    }, {
        id: 'department'
    }]
});

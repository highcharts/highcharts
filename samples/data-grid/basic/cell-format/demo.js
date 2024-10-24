DataGrid.dataGrid('container', {
    dataTable: {
        columns: {
            ID: [1, 2, 3, 4, 5],
            Name: ['Alice', 'Bob', 'Charlie', 'David', 'Eve'],
            HireDate: [
                1579046400000,
                1532304000000,
                1552176000000,
                1622332800000,
                1510963200000
            ],
            Age: [28, 35, 40, 23, 30],
            Department: ['HR', 'Engineering', 'Sales', 'Marketing', 'Finance'],
            Salary: [50000, 75000, 55000, 45000, 65000],
            PerformanceScore: [85, 70, 95, 60, 88]
        }
    },
    columns: [{
        id: 'HireDate',
        cells: {
            formatter: function () {
                return new Date(this.value).toLocaleDateString();
            }
        },
        header: {
            format: 'Hire date'
        }
    }, {
        id: 'Salary',
        cells: {
            // eslint-disable-next-line max-len
            format: '{#if (gt value 50000)}<span class="highlight-cell">{(divide value 1000):.1f}K $</span>{else}{(divide value 1000):.1f}K ${/if}'
        }
    }, {
        id: 'PerformanceScore',
        cells: {
            // eslint-disable-next-line max-len
            format: '{#if (gt value 80)}<span class="high-color">{value}</span>{else}<span class="low-color">{value}</span>{/if}'
        },
        header: {
            format: 'Performance score (0-100)'
        }
    }]
});

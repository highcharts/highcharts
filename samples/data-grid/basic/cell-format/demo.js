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
            className: '{#if (gt value 50000)}highlight-cell{/if}',
            format: '{(divide value 1000):.1f}K $'
        }
    }, {
        id: 'PerformanceScore',
        cells: {
            className: '{#if (gt value 80)}high{else}low{/if}-color'
        },
        header: {
            format: 'Performance score (0-100)'
        }
    }]
});

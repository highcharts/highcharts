DataGrid.dataGrid('container', {
    dataTable: {
        columns: {
            ID: [1, 2, 3, 4, 5],
            Name: ['Alice', 'Bob', 'Charlie', 'David', 'Eve'],
            Age: [28, 35, 40, 23, 30],
            Department: ['HR', 'Engineering', 'Sales', 'Marketing', 'Finance'],
            Salary: [50000, 75000, 55000, 45000, 65000],
            PerformanceScore: [85, 70, 95, 60, 88]
        }
    },
    columnDefaults: {
        cells: {
            className: '{#if (gt value 30)}over-30{/if}'
        }
    },
    columns: [{
        id: 'ID',
        cells: {
            className: 'highlight-column'
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

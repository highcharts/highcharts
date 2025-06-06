const categories = [
    { value: 'CL', label: 'Cleaning' },
    { value: 'SH', label: 'Shopping' },
    { value: 'CK', label: 'Cooking' },
    { value: 'GR', label: 'Gardening' },
    { value: 'LD', label: 'Laundry' },
    { value: 'MT', label: 'Maintenance' },
    { value: 'OR', label: 'Organization' },
    { value: 'WL', label: 'Walking the dog' },
    { value: 'WD', label: 'Window cleaning' },
    { value: 'PT', label: 'Pet care' },
    { value: 'PL', label: 'Plant care' },
    { value: 'OT', label: 'Other' }
];
const priority = [
    { value: '', label: '' },
    { value: 'L', label: 'Low' },
    { value: 'H', label: 'High' },
    { value: 'M', label: 'Medium' }
];
const columns = [{
    id: 'completed',
    dataType: 'boolean',
    width: 120,
    cells: {
        renderer: {
            type: 'checkbox'
        },
        editMode: {
            renderer: {
                type: 'checkbox'
            }
        }
    }
}, {
    id: 'category',
    dataType: 'string',
    cells: {
        renderer: {
            type: 'select',
            options: categories
        }
    }
}, {
    id: 'dueDate',
    dataType: 'datetime',
    cells: {
        format: '{value:%Y-%m-%d}',
        renderer: {
            type: 'dateInput'
        }
    }
}, {
    id: 'priority',
    dataType: 'string',
    cells: {
        renderer: {
            type: 'select',
            options: priority
        }
    }
}];

Grid.grid('container', {
    dataTable: {
        columns: {
            completed: [false, false, false, false],
            category: ['CL', 'SH', 'CL', 'GR'],
            task: [
                'Do laundry', 'Buy groceries', 'Clean kitchen', 'Water plants'
            ],
            notes: [
                'Use gentle cycle', 'Get milk and eggs', '', 'Front yard only'
            ],
            dueDate: [
                Date.UTC(2025, 6, 1), Date.UTC(2025, 6, 2),
                Date.UTC(2025, 6, 3), Date.UTC(2025, 6, 4)
            ],
            priority: ['L', 'H', 'M', 'L']
        }
    },
    columnDefaults: {
        cells: {
            editMode: {
                enabled: true
            },
            events: {
                afterRender: function () {
                    if (this.column.id === 'completed') {
                        const selected = this.value;

                        if (selected) {
                            const dataTable = this.row.viewport.dataTable;
                            const rowIndex = this.row.index;
                            const data = { ...this.row.data, completed: true };
                            const doneGrid = Grid.grids[1];

                            doneGrid.dataTable.setRow(data);
                            dataTable.deleteRows(rowIndex);

                            doneGrid.viewport.loadPresentationData();
                            this.row.viewport.loadPresentationData();
                        }
                    }
                }
            }
        }
    },
    columns: columns
});

Grid.grid('container-done', {
    dataTable: {
        columns: {
            completed: [true, true, true],
            category: ['CK', 'GR', 'MT'],
            task: ['Cook dinner', 'Trim hedges', 'Fix leaking tap'],
            notes: [
                'Try new pasta recipe', 'Backyard only', 'Check under sink'
            ],
            dueDate: ['2025-06-08', '2025-06-09', '2025-06-10'],
            priority: ['M', 'L', 'H']
        }
    },
    columnDefaults: {
        cells: {
            editMode: {
                enabled: true
            },
            events: {
                afterRender: function () {
                    if (this.column.id === 'completed') {
                        const selected = this.value;

                        if (selected === false) {
                            const dataTable = this.row.viewport.dataTable;
                            const rowIndex = this.row.index;
                            const data = { ...this.row.data, completed: false };
                            const todoGrid = Grid.grids[0];

                            dataTable.deleteRows(rowIndex);
                            todoGrid.dataTable.setRow(data);

                            this.row.viewport.loadPresentationData();
                            todoGrid.viewport.loadPresentationData();
                        }
                    }
                }
            }
        }
    },
    columns: columns
});

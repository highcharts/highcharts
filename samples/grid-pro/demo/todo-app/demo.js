// Constants
const categories = [
    { value: 'CL', label: 'Cleaning' },
    { value: 'SH', label: 'Shopping' },
    { value: 'CK', label: 'Cooking' },
    { value: 'GR', label: 'Gardening' },
    { value: 'LD', label: 'Laundry' },
    { value: 'MT', label: 'Maintenance' },
    { value: 'OR', label: 'Organization' },
    { value: 'PT', label: 'Pet care' },
    { value: 'OT', label: 'Other' }
];
const priority = [
    { value: 'Low', label: 'Low' },
    { value: 'Medium', label: 'Medium' },
    { value: 'High', label: 'High' }
];
const columns = [{
    id: 'Completed',
    dataType: 'boolean',
    width: 120,
    cells: {
        renderer: {
            type: 'checkbox'
        }
    }
}, {
    id: 'Category',
    dataType: 'string',
    cells: {
        renderer: {
            type: 'text'
        },
        formatter: function () {
            return categories.find(({ value }) => value === this.value)
                ?.label || '';
        },
        editMode: {
            renderer: {
                type: 'select',
                options: categories
            }
        }
    }
}, {
    id: 'Due date',
    dataType: 'datetime',
    cells: {
        format: '{value:%Y-%m-%d}',
        editMode: {
            renderer: {
                type: 'dateInput'
            }
        }
    }
}, {
    id: 'Priority',
    dataType: 'string',
    cells: {
        formatter: function () {
            const map = {
                High: '🔴',
                Low: '🟢',
                Medium: '🟡'
            };
            return map[this.value] || '';
        },
        editMode: {
            renderer: {
                type: 'select',
                options: priority
            }
        }
    }
}];

// Grid setup
Grid.grid('container', {
    dataTable: {
        columns: {
            Completed: [false, false, false, false],
            Category: ['CL', 'SH', 'CL', 'GR'],
            Task: [
                'Do laundry', 'Buy groceries', 'Clean kitchen', 'Water plants '
            ],
            Notes: [
                'Use gentle cycle', 'Get milk and eggs', '',
                // eslint-disable-next-line max-len
                'In the kitchen use 2 cups of water, in the living room use 1 cup, do not water the cactus in the garden'
            ],
            'Due date': [
                Date.UTC(2025, 6, 1), Date.UTC(2025, 6, 2),
                Date.UTC(2025, 6, 3), Date.UTC(2025, 6, 4)
            ],
            Priority: ['Low', 'High', 'Medium', 'Low']
        }
    },
    columnDefaults: {
        cells: {
            editMode: {
                enabled: true
            }
        }
    },
    columns: columns
});
Grid.grid('container-done', {
    dataTable: {
        columns: {
            Completed: [true, true, true],
            Category: ['CK', 'GR', 'MT'],
            Task: ['Cook dinner', 'Trim hedges', 'Fix leaking tap'],
            Notes: [
                'Try new pasta recipe', 'Backyard only', 'Check under sink'
            ],
            'Due date': ['2025-06-08', '2025-06-09', '2025-06-10'],
            Priority: ['Medium', 'Low', 'High']
        }
    },
    columnDefaults: {
        cells: {
            editMode: {
                enabled: true
            }
        }
    },
    columns: columns
});

// Custom events
Grid.grids[0].dataTable.on('afterSetCell', function (e) {
    if (e.columnName === 'Completed') {
        const selected = e.cellValue;
        const todoGrid = Grid.grids[0];
        const doneGrid = Grid.grids[1];

        if (selected) {
            const dataTable = e.target;
            const rowIndex = e.rowIndex;
            const rowData = dataTable.getRowObject(rowIndex);
            const data = { ...rowData, Completed: true };

            doneGrid.dataTable.setRow(data);
            dataTable.deleteRows(rowIndex);

            doneGrid.viewport.loadPresentationData();
            todoGrid.viewport.loadPresentationData();
        }
    }
});
Grid.grids[1].dataTable.on('afterSetCell', function (e) {
    if (e.columnName === 'Completed') {
        const selected = e.cellValue;
        const todoGrid = Grid.grids[0];
        const doneGrid = Grid.grids[1];

        if (!selected) {
            const dataTable = e.target;
            const rowIndex = e.rowIndex;
            const rowData = dataTable.getRowObject(rowIndex);
            const data = { ...rowData, Completed: false };

            todoGrid.dataTable.setRow(data);
            dataTable.deleteRows(rowIndex);

            doneGrid.viewport.loadPresentationData();
            todoGrid.viewport.loadPresentationData();
        }
    }
});


// Modal setup
const modal = document.getElementById('modal');
const openModal = document.getElementById('openModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const form = document.getElementById('todoForm');
const select = document.getElementById('categorySelect');
const prioritySelect = document.getElementById('prioritySelect');

select.append(new Option('Select a category', '', false, false));
categories.forEach(({ value, label }) => {
    select.append(new Option(label, value));
});
prioritySelect.append(new Option('Select a priority', '', true, true));
priority.forEach(({ value, label }) => {
    prioritySelect.append(new Option(label, value));
});

openModal.addEventListener('click', () => {
    modal.style.display = 'flex';
});
closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

form.addEventListener('submit', function (e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const todoGrid = Grid.grids[0];

    todoGrid.dataTable.setRow({
        Completed: false,
        Category: formData.get('category'),
        Task: formData.get('task'),
        Notes: formData.get('notes'),
        'Due date': formData.get('dueDate'),
        Priority: formData.get('priority')
    });
    todoGrid.viewport.loadPresentationData();


    form.reset();
    modal.style.display = 'none';
});

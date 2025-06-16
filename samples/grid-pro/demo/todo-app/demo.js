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
    { value: 'High', label: 'High' },
    { value: 'Medium', label: 'Medium' }
];
const columns = [{
    id: 'Completed',
    dataType: 'boolean',
    width: 120,
    cells: {
        formatter: function () {
            const map = {
                false: '❌',
                true: '✅'
            };
            return map[this.value] || '';
        },
        editMode: {
            renderer: {
                type: 'select',
                options: [
                    { value: true, label: 'Yes' },
                    { value: false, label: 'No' }
                ]
            }
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
            },
            events: {
                afterEdit: function () {
                    if (this.column.id === 'Completed') {
                        const selected = this.value;

                        if (selected === 'true') {
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
            },
            events: {
                afterEdit: function () {
                    if (this.column.id === 'Completed') {
                        const selected = this.value;

                        if (selected === 'false') {
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
        completed: false,
        category: formData.get('Category'),
        task: formData.get('task'),
        notes: formData.get('notes'),
        dueDate: formData.get('Due date'),
        priority: formData.get('Priority')
    });
    todoGrid.viewport.loadPresentationData();


    form.reset();
    modal.style.display = 'none';
});

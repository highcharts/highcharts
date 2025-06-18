// Constants
const categories = [
    { value: '1', label: 'Cleaning' },
    { value: '2', label: 'Shopping' },
    { value: '3', label: 'Cooking' },
    { value: '4', label: 'Gardening' },
    { value: '5', label: 'Laundry' },
    { value: '6', label: 'Maintenance' },
    { value: '7', label: 'Organization' },
    { value: '8', label: 'Pet care' },
    { value: '9', label: 'Other' }
];
const priority = [
    { value: 'Low', label: 'Low' },
    { value: 'Medium', label: 'Medium' },
    { value: 'High', label: 'High' }
];
const columns = [{
    id: 'Done',
    dataType: 'boolean',
    showInForm: false,
    width: 80,
    cells: {
        renderer: {
            type: 'checkbox'
        }
    }
}, {
    id: 'Category',
    dataType: 'string',
    showInForm: true,
    cells: {
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
    id: 'Task',
    showInForm: true
}, {
    id: 'Notes',
    showInForm: true
}, {
    id: 'Due date',
    dataType: 'datetime',
    showInForm: true,
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
    showInForm: true,
    width: 120,
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
            Done: [false, false, false, false],
            Category: ['1', '2', '1', '4'],
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
            Done: [true, true, true],
            Category: ['3', '4', '6'],
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
function addCustomEvents(isTodoGrid) {
    const sourceGrid = Grid.grids[isTodoGrid ? 0 : 1];
    const targetGrid = Grid.grids[isTodoGrid ? 1 : 0];

    sourceGrid.dataTable.on('afterSetCell', function (e) {
        if (e.columnName !== 'Done') {
            return;
        }

        const selected = e.cellValue;
        if ((isTodoGrid && selected) || (!isTodoGrid && !selected)) {
            const dataTable = e.target;
            const rowIndex = e.rowIndex;
            const rowData = dataTable.getRowObject(rowIndex);
            const data = { ...rowData, Completed: selected };

            targetGrid.dataTable.setRow(data);
            dataTable.deleteRows(rowIndex);

            sourceGrid.viewport.loadPresentationData();
            targetGrid.viewport.loadPresentationData();
        }
    });
}
addCustomEvents(true);
addCustomEvents(false);

// Generate modal
const container = document.getElementById('formFieldsContainer');
const form = document.getElementById('todoForm');
const modal = document.getElementById('modal');
const openModal = document.getElementById('openModal');
const closeModalBtn = document.getElementById('closeModalBtn');

columns.forEach(col => {
    if (col.showInForm === false) {
        return;
    }

    const fieldId = col.id;
    const renderer = col.cells?.editMode?.renderer;

    const label = document.createElement('label');
    label.textContent = fieldId;
    label.htmlFor = fieldId;

    let input;

    if (fieldId === 'Notes') {
        input = document.createElement('textarea');
    } else if (renderer?.type === 'checkbox') {
        input = document.createElement('input');
        input.type = 'checkbox';
    } else if (renderer?.type === 'select') {
        input = document.createElement('select');
        input.append(new Option(`Select ${fieldId}`, '', true, true));
        (renderer.options || []).forEach(({ value, label }) => {
            input.append(new Option(label, value));
        });
    } else if (renderer?.type === 'dateInput') {
        input = document.createElement('input');
        input.type = 'date';
    } else {
        input = document.createElement('input');
        input.type = 'text';
    }

    input.name = fieldId;
    input.id = fieldId;

    if (['Task', 'Category'].includes(fieldId)) {
        input.required = true;
    }

    container.appendChild(label);
    container.appendChild(input);
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
        Category: formData.get('Category'),
        Task: formData.get('Task'),
        Notes: formData.get('Notes'),
        'Due date': formData.get('Due date'),
        Priority: formData.get('Priority')
    });
    todoGrid.viewport.loadPresentationData();

    form.reset();
    modal.style.display = 'none';
});

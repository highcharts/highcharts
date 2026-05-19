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
    { value: 1, label: 'Low' },
    { value: 2, label: 'Medium' },
    { value: 3, label: 'High' }
];
const columns = [{
    id: 'Done',
    dataType: 'boolean',
    showInForm: false,
    className: 'centered',
    width: 80,
    cells: {
        renderer: {
            type: 'checkbox'
        }
    },
    header: {
        className: 'centered-header'
    }
}, {
    id: 'Category',
    cells: {
        formatter: function () {
            return categories.find(({ value }) => value === this.value)
                ?.label || '';
        },
        editMode: {
            renderer: {
                type: 'select',
                options: categories
            },
            validationRules: ['notEmpty']
        }
    }
}, {
    id: 'Task',
    cells: {
        editMode: {
            validationRules: ['notEmpty']
        }
    }
}, {
    id: 'Notes'
}, {
    id: 'Due date',
    dataType: 'datetime',
    cells: {
        formatter: function () {
            return this.value ? new Date(this.value).toLocaleDateString(
                navigator.language
            ) : '';
        },
        editMode: {
            renderer: {
                type: 'dateInput'
            }
        }
    }
}, {
    id: 'Priority',
    className: 'centered',
    width: 120,
    cells: {
        formatter: function () {
            const map = {
                1: '🟢',
                2: '🟡',
                3: '🔴'
            };
            return map[this.value] || '';
        },
        editMode: {
            renderer: {
                type: 'select',
                options: priority
            }
        }
    },
    header: {
        className: 'centered-header'
    }
}];

// Grid setup
const todoGrid = Grid.grid('container', {
    time: {
        locale: ''
    },
    data: {
        columns: {
            Done: [false, false, false, false],
            Category: ['CL', 'SH', 'CL', 'GR'],
            Task: [
                'Do laundry', 'Buy groceries', 'Clean kitchen', 'Water plants '
            ],
            Notes: [
                'Use gentle cycle', 'Get milk and eggs', '',
                'In the kitchen use 2 cups of water'
            ],
            'Due date': [
                Date.UTC(2025, 6, 1),
                Date.UTC(2025, 6, 2),
                Date.UTC(2025, 6, 3),
                Date.UTC(2025, 6, 4)
            ],
            Priority: [1, 3, 2, 1]
        }
    },
    columnDefaults: {
        cells: {
            editMode: {
                enabled: true
            }
        }
    },
    columns: columns,
    credits: {
        enabled: false
    }
});

const doneGrid = Grid.grid('container-done', {
    data: {
        columns: {
            Done: [true, true, true],
            Category: ['CK', 'GR', 'MT'],
            Task: ['Cook dinner', 'Trim hedges', 'Fix leaking tap'],
            Notes: [
                'Try new pasta recipe', 'Backyard only', 'Check under sink'
            ],
            'Due date': [
                Date.UTC(2025, 6, 8),
                Date.UTC(2025, 6, 9),
                Date.UTC(2025, 6, 10)
            ],
            Priority: [2, 1, 3]
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
function addCustomEvents(sourceGrid, targetGrid, isTodoGrid) {
    const sourceTable = sourceGrid.dataProvider?.getDataTable();
    const targetTable = targetGrid.dataProvider?.getDataTable();

    if (!sourceTable || !targetTable) {
        return;
    }

    sourceTable.on('afterSetCell', function (e) {
        if (e.columnId !== 'Done') {
            return;
        }

        const selected = e.cellValue;
        if ((isTodoGrid && selected) || (!isTodoGrid && !selected)) {
            const dataTable = e.target;
            const rowIndex = e.rowIndex;
            const rowData = dataTable.getRowObject(rowIndex);

            if (!rowData) {
                return;
            }

            const data = { ...rowData, Done: selected };
            const accessibility = sourceGrid.accessibility;
            const taskName = data.Task;

            targetTable.setRow(data);
            dataTable.deleteRows(rowIndex);

            sourceGrid.viewport.updateRows();
            targetGrid.viewport.updateRows();

            // Accessibility
            accessibility.announce(
                `Moved ${taskName} to ${
                    isTodoGrid && selected ? 'Done' : 'Todo'
                }.`,
                true
            );
        }
    });
}
addCustomEvents(todoGrid, doneGrid, true);
addCustomEvents(doneGrid, todoGrid, false);

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

    if (renderer?.type === 'checkbox') {
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

    if (col.cells?.editMode?.validationRules?.includes('notEmpty')) {
        input.required = true;
    }

    container.appendChild(label);
    container.appendChild(input);
});

openModal.addEventListener('click', () => {
    modal.style.display = 'flex';

    document.getElementById('Category').focus();
});
closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        modal.style.display = 'none';
    }
});

form.addEventListener('submit', function (e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const rowData = {};

    for (const column of columns) {
        if (column.showInForm === false) {
            continue;
        }

        const key = column.id;
        const value = formData.get(key);
        rowData[key] = value;
    }

    todoGrid.dataProvider?.getDataTable()?.setRow(rowData);
    todoGrid.viewport.updateRows();

    form.reset();
    modal.style.display = 'none';
});

document.getElementById('close-popup').addEventListener('click', () => {
    modal.style.display = 'none';
});

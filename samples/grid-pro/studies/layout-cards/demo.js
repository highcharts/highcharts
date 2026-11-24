const board = [
    {
        id: 'todo',
        title: 'To do',
        tone: 'todo',
        tasks: [
            { title: 'Group the day headers', detail: 'Gantt' },
            { title: 'Match the card gaps', detail: 'Layout' },
            { title: 'Write the layout notes', detail: 'Docs' },
            { title: 'Sample the week view', detail: 'Calendar' }
        ]
    },
    {
        id: 'progress',
        title: 'In progress',
        tone: 'progress',
        tasks: [
            { title: 'Sprint board demo', detail: 'Cards' },
            { title: 'Month switching', detail: 'Calendar' },
            { title: 'Bar across day cells', detail: 'Gantt' },
            { title: 'Row height variable', detail: 'CSS' }
        ]
    },
    {
        id: 'review',
        title: 'In review',
        tone: 'review',
        tasks: [
            { title: 'Table layout option', detail: 'API' },
            { title: 'Strict row heights', detail: 'Grid' },
            { title: 'Pro-only composition', detail: 'Bundle' },
            { title: 'Card class on the cell', detail: 'CSS' }
        ]
    },
    {
        id: 'done',
        title: 'Done',
        tone: 'done',
        tasks: [
            { title: 'Drop the tableView key', detail: 'API' },
            { title: 'Keep tasks in the demo', detail: 'Calendar' },
            { title: 'Virtualize Gantt rows', detail: 'Gantt' },
            { title: 'Reuse column widths', detail: 'Grid' }
        ]
    }
];

function formatTask() {
    const column = board.find((item) => item.id === this.column.id);
    const task = column && column.tasks[this.value];

    if (!task) {
        return '';
    }

    return '<div class="task ' + column.tone + '">' +
        '<h3>' + task.title + '</h3>' +
        '<p>' + task.detail + '</p>' +
        '</div>';
}

const rowCount = Math.max.apply(null, board.map((column) => column.tasks.length));
const dataColumns = {};
const columns = board.map((column) => {
    const values = [];

    for (let row = 0; row < rowCount; row++) {
        values.push(row < column.tasks.length ? row : '');
    }

    dataColumns[column.id] = values;

    return {
        id: column.id,
        width: (100 / board.length) + '%',
        header: {
            format: column.title
        },
        cells: {
            formatter: formatTask
        }
    };
});

Grid.grid('container', {
    data: {
        columns: dataColumns
    },
    columns: columns,
    rendering: {
        columns: {
            resizing: {
                enabled: false
            }
        },
        rows: {
            virtualization: false
        },
        table: {
            layout: 'cards'
        }
    },
    columnDefaults: {
        sorting: {
            enabled: false
        }
    }
});

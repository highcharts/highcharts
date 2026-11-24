const DAY_LETTERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTHS = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const GROUP = [
    { id: 1, parentId: null, name: 'Parent', start: '2026-01-05', duration: 29, kind: 'parent' },
    { id: 2, parentId: 1, name: 'Sub-parent', suffix: '.1', start: '2026-01-05', duration: 15, kind: 'parent' },
    { id: 3, parentId: 2, name: 'Task', suffix: '.1.1', start: '2026-01-05', duration: 4, kind: 'task' },
    { id: 4, parentId: 2, name: 'Task', suffix: '.1.2', start: '2026-01-09', duration: 5, kind: 'task' },
    { id: 5, parentId: 2, name: 'Task', suffix: '.1.3', start: '2026-01-14', duration: 4, kind: 'task' },
    { id: 6, parentId: 2, name: 'Task', suffix: '.1.4', start: '2026-01-18', duration: 2, kind: 'task' },
    { id: 7, parentId: 1, name: 'Sub-parent', suffix: '.2', start: '2026-01-20', duration: 14, kind: 'parent' },
    { id: 8, parentId: 7, name: 'Task', suffix: '.2.1', start: '2026-01-20', duration: 5, kind: 'task' },
    { id: 9, parentId: 7, name: 'Task', suffix: '.2.2', start: '2026-01-25', duration: 3, kind: 'task' },
    { id: 10, parentId: 7, name: 'Task', suffix: '.2.3', start: '2026-01-28', duration: 6, kind: 'task' }
];

const ROW_COUNT = 10000;

function buildRows() {
    const rows = [];
    const groups = ROW_COUNT / GROUP.length;

    for (let group = 0; group < groups; group++) {
        const base = group * GROUP.length;
        const label = group + 1;

        for (let index = 0; index < GROUP.length; index++) {
            const item = GROUP[index];

            rows.push({
                id: base + item.id,
                parentId: item.parentId === null ? null : base + item.parentId,
                name: item.name + ' ' + label + (item.suffix || ''),
                start: item.start,
                duration: item.duration,
                kind: item.kind
            });
        }
    }

    return rows;
}

const ROWS = buildRows();

function parseISO(iso) {
    const parts = iso.split('-').map(Number);
    return new Date(parts[0], parts[1] - 1, parts[2]);
}

function toISO(date) {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day}`;
}

function addDays(iso, amount) {
    const date = parseISO(iso);
    return toISO(new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() + amount
    ));
}

function pretty(iso) {
    const date = parseISO(iso);
    return `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

function weekLabel(iso) {
    const date = parseISO(iso);
    const day = String(date.getDate()).padStart(2, '0');
    return `Sun ${day} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

function buildDays() {
    const days = [];
    let iso = '2026-01-04';

    for (let index = 0; index < 35; index++) {
        days.push(iso);
        iso = addDays(iso, 1);
    }

    return days;
}

const DAYS = buildDays();

function column(id) {
    return ROWS.map((row) => row[id]);
}

function formatDay() {
    const day = this.column.id.slice(1);
    const start = this.row.data.start;
    const duration = this.row.data.duration;
    const end = addDays(start, duration - 1);

    if (day < start || day > end) {
        return '';
    }

    const isStart = day === start;
    const isEnd = day === end;
    let role = 'mid';

    if (isStart && isEnd) {
        role = 'single';
    } else if (isStart) {
        role = 'start';
    } else if (isEnd) {
        role = 'end';
    }

    const kind = this.row.data.kind === 'parent' ? ' is-parent' : '';

    return `<div class="gantt-track"><div class="gantt-bar is-${role}${kind}"></div></div>`;
}

const columns = {
    id: column('id'),
    parentId: column('parentId'),
    name: column('name'),
    start: column('start'),
    duration: column('duration'),
    kind: column('kind'),
    startLabel: ROWS.map((row) => pretty(row.start)),
    durationLabel: ROWS.map((row) => `${row.duration} days`)
};

DAYS.forEach((iso) => {
    columns['d' + iso] = ROWS.map(() => '');
});

const header = ['name', 'startLabel', 'durationLabel'];

for (let week = 0; week < 5; week++) {
    const weekDays = DAYS.slice(week * 7, week * 7 + 7);

    header.push({
        format: weekLabel(weekDays[0]),
        columns: weekDays.map((iso) => ({
            columnId: 'd' + iso
        }))
    });
}

const dayColumns = DAYS.map((iso) => {
    const weekend = parseISO(iso).getDay() % 6 === 0;

    return {
        id: 'd' + iso,
        dataType: 'string',
        width: 28,
        className: weekend ? 'gantt-day gantt-weekend' : 'gantt-day',
        header: {
            format: DAY_LETTERS[parseISO(iso).getDay()],
            className: 'gantt-dow'
        },
        cells: {
            formatter: formatDay
        }
    };
});

Grid.grid('container', {
    data: {
        columns,
        idColumn: 'id'
    },
    treeView: {
        enabled: true,
        treeColumn: 'name'
    },
    rendering: {
        rows: {
            virtualization: true,
            strictHeights: true,
            expandedLevels: 'all'
        },
        columns: {
            virtualization: false,
            resizing: {
                enabled: false
            }
        },
        table: {
            layout: 'matrix'
        }
    },
    columnDefaults: {
        sorting: {
            enabled: false
        }
    },
    header,
    columns: [
        {
            id: 'name',
            width: 220,
            header: {
                format: 'Name'
            }
        },
        {
            id: 'startLabel',
            width: 120,
            header: {
                format: 'Start date'
            }
        },
        {
            id: 'durationLabel',
            width: 90,
            header: {
                format: 'Duration'
            }
        }
    ].concat(dayColumns)
});

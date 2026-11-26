const DAY = 24 * 36e5;

const today = new Date();
const year = today.getFullYear();
const month = today.getMonth();
const start = Date.UTC(year, month, 1);
const header = ['name', 'start', 'days'];
const days = [];

const tasks = [
    {
        id: 1,
        parentId: null,
        name: 'Website redesign',
        start: Date.UTC(year, month, 5),
        days: 29,
        group: true
    },
    {
        id: 2,
        parentId: 1,
        name: 'Design',
        start: Date.UTC(year, month, 5),
        days: 15,
        group: true
    },
    {
        id: 3,
        parentId: 2,
        name: 'Research',
        start: Date.UTC(year, month, 5),
        days: 4
    },
    {
        id: 4,
        parentId: 2,
        name: 'Wireframes',
        start: Date.UTC(year, month, 9),
        days: 5
    },
    {
        id: 5,
        parentId: 2,
        name: 'Visual design',
        start: Date.UTC(year, month, 14),
        days: 4
    },
    {
        id: 6,
        parentId: 2,
        name: 'Design review',
        start: Date.UTC(year, month, 18),
        days: 2
    },
    {
        id: 7,
        parentId: 1,
        name: 'Build',
        start: Date.UTC(year, month, 20),
        days: 14,
        group: true
    },
    {
        id: 8,
        parentId: 7,
        name: 'Frontend',
        start: Date.UTC(year, month, 20),
        days: 5
    },
    {
        id: 9,
        parentId: 7,
        name: 'Content',
        start: Date.UTC(year, month, 25),
        days: 3
    },
    {
        id: 10,
        parentId: 7,
        name: 'QA',
        start: Date.UTC(year, month, 28),
        days: 6
    },
    {
        id: 11,
        parentId: null,
        name: 'Mobile app',
        start: Date.UTC(year, month, 5),
        days: 29,
        group: true
    },
    {
        id: 12,
        parentId: 11,
        name: 'Prototype',
        start: Date.UTC(year, month, 5),
        days: 15,
        group: true
    },
    {
        id: 13,
        parentId: 12,
        name: 'Flows',
        start: Date.UTC(year, month, 5),
        days: 4
    },
    {
        id: 14,
        parentId: 12,
        name: 'UI kit',
        start: Date.UTC(year, month, 9),
        days: 5
    },
    {
        id: 15,
        parentId: 12,
        name: 'Clickable demo',
        start: Date.UTC(year, month, 14),
        days: 4
    },
    {
        id: 16,
        parentId: 12,
        name: 'Usability test',
        start: Date.UTC(year, month, 18),
        days: 2
    },
    {
        id: 17,
        parentId: 11,
        name: 'Release',
        start: Date.UTC(year, month, 20),
        days: 14,
        group: true
    },
    {
        id: 18,
        parentId: 17,
        name: 'Implementation',
        start: Date.UTC(year, month, 20),
        days: 5
    },
    {
        id: 19,
        parentId: 17,
        name: 'Store listing',
        start: Date.UTC(year, month, 25),
        days: 3
    },
    {
        id: 20,
        parentId: 17,
        name: 'Rollout',
        start: Date.UTC(year, month, 28),
        days: 6
    },
    {
        id: 21,
        parentId: null,
        name: 'Data migration',
        start: Date.UTC(year, month, 5),
        days: 29,
        group: true
    },
    {
        id: 22,
        parentId: 21,
        name: 'Extract',
        start: Date.UTC(year, month, 5),
        days: 15,
        group: true
    },
    {
        id: 23,
        parentId: 22,
        name: 'Source map',
        start: Date.UTC(year, month, 5),
        days: 4
    },
    {
        id: 24,
        parentId: 22,
        name: 'Export',
        start: Date.UTC(year, month, 9),
        days: 5
    },
    {
        id: 25,
        parentId: 22,
        name: 'Validation',
        start: Date.UTC(year, month, 14),
        days: 4
    },
    {
        id: 26,
        parentId: 22,
        name: 'Cleanup',
        start: Date.UTC(year, month, 18),
        days: 2
    },
    {
        id: 27,
        parentId: 21,
        name: 'Load',
        start: Date.UTC(year, month, 20),
        days: 14,
        group: true
    },
    {
        id: 28,
        parentId: 27,
        name: 'Import',
        start: Date.UTC(year, month, 20),
        days: 5
    },
    {
        id: 29,
        parentId: 27,
        name: 'Reconciliation',
        start: Date.UTC(year, month, 25),
        days: 3
    },
    {
        id: 30,
        parentId: 27,
        name: 'Cutover',
        start: Date.UTC(year, month, 28),
        days: 6
    }
];

for (
    let time = start - new Date(start).getUTCDay() * DAY;
    time < Date.UTC(year, month, 34) || days.length % 7;
    time += DAY
) {
    days.push(time);
}

for (let week = 0; week < days.length; week += 7) {
    const time = days[week];
    const thursday = time + 4 * DAY;
    const yearStart = Date.UTC(
        new Date(thursday).getUTCFullYear(),
        0,
        1
    );
    const number = Math.ceil(((thursday - yearStart) / DAY + 1) / 7);

    header.push({
        format: 'Week ' + number,
        columns: days.slice(week, week + 7).map(day => ({
            columnId: String(day)
        }))
    });
}

const grid = Grid.grid('container', {
    time: {
        timezone: 'UTC'
    },
    data: {
        columns: {
            id: tasks.map(task => task.id),
            parentId: tasks.map(task => task.parentId),
            name: tasks.map(task => task.name),
            start: tasks.map(task => task.start),
            days: tasks.map(task => task.days),
            group: tasks.map(task => task.group)
        },
        idColumn: 'id'
    },
    treeView: {
        enabled: true,
        treeColumn: 'name'
    },
    rendering: {
        rows: {
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
        },
        width: `${65 / days.length}%`
    },
    header,
    columns: [
        {
            id: 'name',
            width: '15%',
            header: {
                format: 'Name'
            }
        },
        {
            id: 'start',
            width: '10%',
            className: 'gantt-start',
            header: {
                format: 'Start date'
            },
            cells: {
                formatter: function () {
                    return grid.time.dateFormat('%b %e, %Y', this.value)
                        .replace('  ', ' ');
                }
            }
        },
        {
            id: 'days',
            width: '10%',
            header: {
                format: 'Duration'
            },
            cells: {
                formatter: function () {
                    return this.value + ' days';
                }
            }
        }
    ].concat(days.map(time => {
        const date = new Date(time);
        const weekend = date.getUTCDay() % 6 === 0;

        return {
            id: String(time),
            dataId: null,
            className: weekend ? 'gantt-day gantt-weekend' : 'gantt-day',
            header: {
                format: date.toLocaleDateString('en-GB', {
                    weekday: 'narrow',
                    timeZone: 'UTC'
                }),
                className: 'gantt-dow'
            },
            cells: {
                formatter: formatDay
            }
        };
    }))
});

document.getElementById('gantt-label').textContent =
    grid.time.dateFormat('%B %Y', start);

function formatDay() {
    const time = Number(this.column.id);
    const start = this.row.data.start;
    const end = start + (this.row.data.days - 1) * DAY;

    if (time < start || time > end) {
        return '';
    }

    let role = 'mid';

    if (start === end) {
        role = 'single';
    } else if (time === start) {
        role = 'start';
    } else if (time === end) {
        role = 'end';
    }

    const parent = this.row.data.group ? ' is-parent' : '';

    return '<div class="gantt-track">' +
        '<div class="gantt-bar is-' + role + parent + '"></div>' +
        '</div>';
}

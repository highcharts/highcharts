const DAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

const today = new Date();
let visibleMonth = Date.UTC(today.getFullYear(), today.getMonth(), 1);

const tasks = [
    {
        title: 'Standup',
        description: 'Daily sync',
        dateFrom: Date.UTC(today.getFullYear(), today.getMonth(), 3),
        dateTo: Date.UTC(today.getFullYear(), today.getMonth(), 3)
    },
    {
        title: 'Design review',
        description: 'Layout and API',
        dateFrom: Date.UTC(today.getFullYear(), today.getMonth(), 10),
        dateTo: Date.UTC(today.getFullYear(), today.getMonth(), 12)
    },
    {
        title: 'Release',
        description: 'Ship the build',
        dateFrom: Date.UTC(today.getFullYear(), today.getMonth(), 18),
        dateTo: Date.UTC(today.getFullYear(), today.getMonth(), 21)
    },
    {
        title: 'QA',
        description: 'Check the bars',
        dateFrom: Date.UTC(today.getFullYear(), today.getMonth(), 10),
        dateTo: Date.UTC(today.getFullYear(), today.getMonth(), 11)
    },
    {
        title: 'Sync',
        description: 'Team catch-up',
        dateFrom: Date.UTC(today.getFullYear(), today.getMonth(), 10),
        dateTo: Date.UTC(today.getFullYear(), today.getMonth(), 10)
    }
];

function buildMonthColumns(monthTime) {
    const date = new Date(monthTime);
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();
    const first = new Date(Date.UTC(year, month, 1));
    const last = new Date(Date.UTC(year, month + 1, 0));
    let day = 1 - first.getUTCDay();
    const columns = {
        sun: [],
        mon: [],
        tue: [],
        wed: [],
        thu: [],
        fri: [],
        sat: []
    };

    while (day <= last.getUTCDate() + (6 - last.getUTCDay())) {
        for (const id of DAYS) {
            columns[id].push(Date.UTC(year, month, day));
            day++;
        }
    }

    return columns;
}

const grid = Grid.grid('container', {
    time: {
        timezone: 'UTC'
    },
    data: {
        columns: buildMonthColumns(visibleMonth),
        updateOnChange: true
    },
    rendering: {
        columns: {
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
        width: `${100 / 7}%`,
        cells: {
            formatter: formatDay
        }
    },
    columns: DAYS.map(id => ({
        id,
        dataType: 'number',
        header: {
            format: id
        }
    }))
});

function formatDay() {
    const time = this.value;
    const date = new Date(time);
    const month = new Date(visibleMonth);
    const outside = date.getUTCMonth() !== month.getUTCMonth() ||
        date.getUTCFullYear() !== month.getUTCFullYear();
    const isToday = time === Date.UTC(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
    );

    return '<div class="cal-day' + (outside ? ' is-outside' : '') + '">' +
        '<span class="cal-num' + (isToday ? ' is-today' : '') + '">' +
            grid.time.dateFormat('%e', time).trim() +
        '</span>' +
        '<div class="cal-bars">' +
        tasks.map(task => {
            if (time < task.dateFrom || time > task.dateTo) {
                return '';
            }

            let role = 'mid';

            if (task.dateFrom === task.dateTo) {
                role = 'single';
            } else if (time === task.dateFrom) {
                role = 'start';
            } else if (time === task.dateTo) {
                role = 'end';
            }

            return '<div class="cal-bar is-' + role + '">' + (
                role === 'start' || role === 'single' ? task.title : ''
            ) + '</div>';
        }).join('') +
        '</div></div>';
}

function showMonth(time) {
    const date = new Date(time);

    visibleMonth = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1);
    document.getElementById('cal-label').textContent =
        grid.time.dateFormat('%B %Y', visibleMonth);
    grid.dataProvider.getDataTable().setColumns(
        buildMonthColumns(visibleMonth)
    );
}

showMonth(visibleMonth);

document.getElementById('cal-prev').addEventListener('click', () => {
    const date = new Date(visibleMonth);

    showMonth(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() - 1, 1));
});

document.getElementById('cal-next').addEventListener('click', () => {
    const date = new Date(visibleMonth);

    showMonth(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1));
});

document.getElementById('cal-today').addEventListener('click', () => {
    showMonth(Date.UTC(today.getFullYear(), today.getMonth(), 1));
});

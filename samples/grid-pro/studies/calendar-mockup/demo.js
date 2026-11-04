const DAY_IDS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const now = new Date();
let visibleMonth = new Date(now.getFullYear(), now.getMonth(), 1);
let anchor = null;
let pendingEnd = null;
let grid;
let daysTable;
const tasksTable = new Grid.DataTable({
    columns: seedColumns(visibleMonth)
});

const labelEl = document.getElementById('cal-label');
const dialogEl = document.getElementById('cal-dialog');
const rangeEl = document.getElementById('cal-range');
const titleEl = document.getElementById('cal-title');

function toISO(date) {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day}`;
}

function parseISO(iso) {
    const [year, month, day] = iso.split('-').map(Number);
    return new Date(year, month - 1, day);
}

function addDays(date, amount) {
    return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() + amount
    );
}

function seedColumns(monthDate) {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    let friday = 1;

    while (new Date(year, month, friday).getDay() !== 5) {
        friday++;
    }

    const single = toISO(new Date(year, month, 3));
    const reviewStart = toISO(new Date(year, month, 10));
    const reviewEnd = toISO(new Date(year, month, 12));
    const releaseStart = toISO(new Date(year, month + 1, friday));
    const releaseEnd = toISO(new Date(year, month + 1, friday + 3));

    return {
        id: ['standup', 'review', 'release', 'qa', 'sync'],
        title: ['Standup', 'Design review', 'Release', 'QA', 'Sync'],
        start: [single, reviewStart, releaseStart, reviewStart, reviewStart],
        end: [
            single,
            reviewEnd,
            releaseEnd,
            toISO(new Date(year, month, 11)),
            reviewStart
        ]
    };
}

function buildMonthColumns(monthDate) {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    let cursor = addDays(first, -first.getDay());
    const end = addDays(last, 6 - last.getDay());
    const columns = {
        sun: [],
        mon: [],
        tue: [],
        wed: [],
        thu: [],
        fri: [],
        sat: []
    };

    while (cursor <= end) {
        DAY_IDS.forEach((id) => {
            columns[id].push(toISO(cursor));
            cursor = addDays(cursor, 1);
        });
    }

    return columns;
}

function readTasks() {
    const tasks = [];

    for (let index = 0; index < tasksTable.rowCount; index++) {
        tasks.push({
            id: tasksTable.getCell('id', index),
            title: tasksTable.getCell('title', index),
            start: tasksTable.getCell('start', index),
            end: tasksTable.getCell('end', index)
        });
    }

    return tasks;
}

function withLanes(tasks) {
    const sorted = tasks.slice().sort((a, b) => (
        a.start < b.start ? -1 : a.start > b.start ? 1 : 0
    ));
    const laneEnds = [];

    return sorted.map((task) => {
        let lane = laneEnds.findIndex((end) => end < task.start);

        if (lane === -1) {
            lane = laneEnds.length;
            laneEnds.push(task.end);
        } else {
            laneEnds[lane] = task.end;
        }

        return Object.assign({ lane }, task);
    });
}

function segmentRole(iso, task) {
    if (iso < task.start || iso > task.end) {
        return null;
    }

    if (task.start === task.end) {
        return 'single';
    }

    const weekday = parseISO(iso).getDay();
    const isStart = iso === task.start || weekday === 0;
    const isEnd = iso === task.end || weekday === 6;

    if (isStart && isEnd) {
        return 'single';
    }
    if (isStart) {
        return 'start';
    }
    if (isEnd) {
        return 'end';
    }
    return 'mid';
}

function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        '\'': '&#39;'
    }[char]));
}

function formatDay() {
    const iso = this.value;
    const date = parseISO(iso);
    const outside = date.getMonth() !== visibleMonth.getMonth() ||
        date.getFullYear() !== visibleMonth.getFullYear();
    const rangeStart = anchor && pendingEnd ?
        (anchor < pendingEnd ? anchor : pendingEnd) :
        null;
    const rangeEnd = anchor && pendingEnd ?
        (anchor < pendingEnd ? pendingEnd : anchor) :
        null;
    const inRange = rangeStart && iso >= rangeStart && iso <= rangeEnd;
    const covering = withLanes(readTasks())
        .map((task) => Object.assign({ role: segmentRole(iso, task) }, task))
        .filter((task) => task.role);
    const bars = [0, 1].map((lane) => {
        const task = covering.find((item) => item.lane === lane);

        if (!task) {
            return covering.some((item) => item.lane > lane) ?
                '<div class="cal-bar-spacer"></div>' :
                '';
        }

        const title = task.role === 'start' || task.role === 'single' ?
            escapeHtml(task.title) :
            '';

        return `<div class="cal-bar lane-${lane} is-${task.role}">${title}</div>`;
    }).join('');
    const extra = covering.filter((task) => task.lane >= 2).length;
    const more = extra ? `<div class="cal-more">+${extra}</div>` : '';
    const classes = [
        'cal-day',
        outside ? 'is-outside' : '',
        inRange ? 'in-range' : ''
    ].filter(Boolean).join(' ');
    const anchorClass = anchor === iso && !pendingEnd ? ' is-anchor' : '';

    return `<div class="${classes}">` +
        `<span class="cal-num${anchorClass}">${date.getDate()}</span>` +
        `<div class="cal-bars">${bars}${more}</div>` +
        '</div>';
}

function refreshRows() {
    if (grid && grid.viewport) {
        grid.viewport.updateRows();
    }
}

function showMonth(monthDate) {
    visibleMonth = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
    anchor = null;
    pendingEnd = null;
    dialogEl.close();
    labelEl.textContent = visibleMonth.toLocaleString('en-US', {
        month: 'long',
        year: 'numeric'
    });
    daysTable.setColumns(buildMonthColumns(visibleMonth));
}

function onDayClick(iso) {
    if (!anchor || anchor === iso) {
        anchor = iso;
        pendingEnd = null;
        refreshRows();
        return;
    }

    pendingEnd = iso < anchor ? anchor : iso;
    anchor = iso < anchor ? iso : anchor;
    rangeEl.textContent = anchor === pendingEnd ?
        anchor :
        `${anchor} – ${pendingEnd}`;
    titleEl.value = '';
    refreshRows();
    dialogEl.showModal();
    titleEl.focus();
}

function commitTask() {
    const title = titleEl.value.trim();

    if (!title) {
        titleEl.focus();
        return;
    }

    tasksTable.setRow({
        id: `task-${Date.now()}`,
        title,
        start: anchor,
        end: pendingEnd
    });
    anchor = null;
    pendingEnd = null;
    dialogEl.close();
    refreshRows();
}

daysTable = new Grid.DataTable({
    columns: buildMonthColumns(visibleMonth)
});

labelEl.textContent = visibleMonth.toLocaleString('en-US', {
    month: 'long',
    year: 'numeric'
});

grid = Grid.grid('container', {
    data: {
        dataTable: daysTable,
        updateOnChange: true
    },
    rendering: {
        rows: {
            virtualization: false
        },
        columns: {
            virtualization: false,
            resizing: {
                enabled: false
            }
        }
    },
    columnDefaults: {
        sorting: {
            enabled: false
        },
        width: `${100 / 7}%`,
        cells: {
            formatter: formatDay,
            events: {
                click: function () {
                    onDayClick(this.value);
                }
            }
        }
    },
    columns: DAY_IDS.map((id, index) => ({
        id,
        dataType: 'string',
        header: {
            format: DAY_LABELS[index]
        }
    }))
});

document.getElementById('cal-prev').addEventListener('click', () => {
    showMonth(new Date(
        visibleMonth.getFullYear(),
        visibleMonth.getMonth() - 1,
        1
    ));
});

document.getElementById('cal-next').addEventListener('click', () => {
    showMonth(new Date(
        visibleMonth.getFullYear(),
        visibleMonth.getMonth() + 1,
        1
    ));
});

document.getElementById('cal-today').addEventListener('click', () => {
    showMonth(new Date());
});

document.getElementById('cal-form').addEventListener('submit', (event) => {
    event.preventDefault();
    commitTask();
});

document.getElementById('cal-cancel').addEventListener('click', () => {
    anchor = null;
    pendingEnd = null;
    dialogEl.close();
    refreshRows();
});

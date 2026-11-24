const cards = [
    { title: 'Group the day headers', detail: 'Gantt', tone: 'todo' },
    { title: 'Match the card gaps', detail: 'Layout', tone: 'progress' },
    { title: 'Write the layout notes', detail: 'Docs', tone: 'review' },
    { title: 'Sample the week view', detail: 'Calendar', tone: 'done' },
    { title: 'Sprint board demo', detail: 'Cards', tone: 'todo' },
    { title: 'Month switching', detail: 'Calendar', tone: 'progress' },
    { title: 'Bar across day cells', detail: 'Gantt', tone: 'review' },
    { title: 'Row height variable', detail: 'CSS', tone: 'done' },
    { title: 'Table layout option', detail: 'API', tone: 'todo' },
    { title: 'Strict row heights', detail: 'Grid', tone: 'progress' },
    { title: 'Pro-only composition', detail: 'Bundle', tone: 'review' },
    { title: 'Card class on the cell', detail: 'CSS', tone: 'done' },
    { title: 'Drop the tableView key', detail: 'API', tone: 'todo' },
    { title: 'Keep tasks in the demo', detail: 'Calendar', tone: 'progress' },
    { title: 'Virtualize Gantt rows', detail: 'Gantt', tone: 'review' },
    { title: 'Reuse column widths', detail: 'Grid', tone: 'done' }
];

const tones = ['todo', 'progress', 'review', 'done'];
const indexes = [];

for (let i = 0; i < cards.length; i++) {
    cards[i].number = i + 1;
    indexes.push(i);
}

function paintRowsOnce() {
    const nodes = document.querySelectorAll('#container .flow-card');

    if (
        nodes.length < cards.length ||
        nodes[0].getBoundingClientRect().width < 1
    ) {
        requestAnimationFrame(paintRowsOnce);
        return;
    }

    const top = nodes[0].getBoundingClientRect().top;
    let columns = 0;

    while (
        columns < nodes.length &&
        nodes[columns].getBoundingClientRect().top <= top + 1
    ) {
        columns++;
    }

    for (let i = 0; i < nodes.length; i++) {
        nodes[i].className = 'flow-card ' +
            tones[Math.floor(i / columns) % tones.length];
    }
}

requestAnimationFrame(paintRowsOnce);

function formatCard() {
    const card = cards[this.value];

    if (!card) {
        return '';
    }

    return '<div class="flow-card ' + card.tone + '">' +
        '<h3>' + card.number + '. ' + card.title + '</h3>' +
        '<p>' + card.detail + '</p>' +
        '</div>';
}

Grid.grid('container', {
    data: {
        columns: {
            card: indexes
        }
    },
    columns: [{
        id: 'card'
    }],
    rendering: {
        header: {
            enabled: false
        },
        columns: {
            resizing: {
                enabled: false
            }
        },
        table: {
            layout: 'flow'
        }
    },
    columnDefaults: {
        sorting: {
            enabled: false
        },
        cells: {
            formatter: formatCard
        }
    }
});

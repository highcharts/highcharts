const rowCount = 60;
const firstNames = [
    'Anna', 'Bjørn', 'Carlos', 'Daria', 'Erik', 'Fatima', 'Jan', 'Kari',
    'Lena', 'Marek', 'Nina', 'Olav'
];
const lastNames = ['Berg', 'Nowak', 'García', 'Hansen', 'Müller'];
const departments = ['Engineering', 'Sales', 'Marketing', 'Support', 'Finance'];
const countries = ['Poland', 'Norway', 'Germany', 'Spain', 'United States'];
const rows = Array.from({ length: rowCount }, (_, i) => i);

// Builder fields. The column types decide the available operators.
const fields = [{
    id: 'name',
    label: 'Name',
    type: 'string',
    values: rows.map(i =>
        firstNames[i % 12] + ' ' + lastNames[(i * 7) % 5]
    )
}, {
    id: 'department',
    label: 'Department',
    type: 'string',
    values: rows.map(i => departments[(i * 3) % 5])
}, {
    id: 'country',
    label: 'Country',
    type: 'string',
    values: rows.map(i => countries[(i * 2 + (i >> 2)) % 5])
}, {
    id: 'salary',
    label: 'Salary',
    type: 'number',
    values: rows.map(i => 45000 + ((i * 7919) % 60) * 1000)
}, {
    id: 'startDate',
    label: 'Start date',
    type: 'datetime',
    values: rows.map(i => Date.UTC(2017 + (i % 9), (i * 5) % 12, 1)),
    cells: { format: '{value:%Y-%m-%d}' }
}, {
    id: 'remote',
    label: 'Remote',
    type: 'boolean',
    values: rows.map(i => i % 3 === 0)
}];

const fieldMap = Object.fromEntries(fields.map(f => [f.id, f]));
const operators = {
    string: [
        'contains', 'doesNotContain', 'equals', 'doesNotEqual',
        'beginsWith', 'endsWith', 'empty', 'notEmpty'
    ],
    number: [
        'equals', 'doesNotEqual', 'greaterThan', 'greaterThanOrEqualTo',
        'lessThan', 'lessThanOrEqualTo', 'empty', 'notEmpty'
    ],
    boolean: ['true', 'false', 'empty']
};
operators.datetime = operators.number;
const noValueOperators = ['empty', 'notEmpty', 'true', 'false'];

const {
    columnFilteringOperators: operatorLabels,
    columnFilteringDateTimeOperators: dateTimeLabels
} = Grid.defaultOptions.lang;

const ui = {
    root: document.getElementById('fb-root'),
    count: document.getElementById('fb-count'),
    status: document.getElementById('fb-status'),
    summary: document.getElementById('fb-summary'),
    json: document.getElementById('fb-json'),
    clear: document.getElementById('fb-clear')
};

let grid, state, timer;

function h(tag, props, ...children) {
    const el = document.createElement(tag);

    Object.entries(props || {}).forEach(([key, value]) => {
        if (key.startsWith('on')) {
            el.addEventListener(key.slice(2), value);
        } else if (key === 'role' || key.includes('-')) {
            el.setAttribute(key, value);
        } else {
            el[key] = value;
        }
    });
    el.append(...children.filter(Boolean));

    return el;
}

function operatorLabel(field, operator) {
    return (field.type === 'datetime' && dateTimeLabels[operator]) ||
        operatorLabels[operator];
}

function hasValue(rule) {
    return noValueOperators.includes(rule.operator) ||
        (rule.value !== void 0 && rule.value !== '');
}

function toInputValue(field, value) {
    if (field.type === 'datetime' && typeof value === 'number') {
        return new Date(value).toISOString().slice(0, 10);
    }
    return value ?? '';
}

function fromInputValue(field, value) {
    if (value === '') {
        return '';
    }
    if (field.type === 'number') {
        return Number(value);
    }
    if (field.type === 'datetime') {
        return Date.parse(value);
    }
    return value;
}

function newRule() {
    return { columnId: 'name', operator: 'contains' };
}

function setOperator(rule, operator) {
    rule.operator = operator;
    if (noValueOperators.includes(operator)) {
        delete rule.value;
    }
}

function countRules(group) {
    return group.conditions.reduce((count, item) => count + (
        item.conditions ? countRules(item) : +hasValue(item)
    ), 0);
}

function describeRule(rule) {
    const field = fieldMap[rule.columnId];
    const label = operatorLabel(field, rule.operator).toLowerCase();

    if (noValueOperators.includes(rule.operator)) {
        return `${field.label} is ${label}`;
    }

    const value = field.type === 'string' ?
        `"${rule.value}"` :
        toInputValue(field, rule.value);

    return `${field.label} ${label} ${value}`;
}

function describe(group, nested) {
    const parts = group.conditions
        .map(item => (
            item.conditions ? describe(item, true) :
                hasValue(item) && describeRule(item)
        ))
        .filter(Boolean);
    const text = parts.join(` ${group.logic || 'and'} `);

    return nested && parts.length > 1 ? `(${text})` : text;
}

// The grid options are the single source of truth. The builder edits a copy
// and replaces the whole filtering state on each change.
function apply(delay) {
    clearTimeout(timer);
    timer = setTimeout(async () => {
        await grid.update({
            filtering: JSON.parse(JSON.stringify(state))
        });
        updateStatus();
    }, delay);
}

async function updateStatus() {
    const filtering = grid.getOptions().filtering || { conditions: [] };
    const count = countRules(filtering);

    ui.count.textContent = count ? `(${count})` : '';
    ui.status.textContent = 'Showing ' +
        await grid.dataProvider.getRowCount() + ` of ${rowCount} rows`;
    ui.summary.textContent = describe(filtering);
    ui.json.textContent = JSON.stringify(filtering, null, 2);
}

function render(focus) {
    ui.root.replaceChildren(renderGroup(state, []));

    const target = focus && ui.root.querySelector(`[data-key="${focus}"]`);
    if (target) {
        (target.querySelector('[data-key^="col-"], button') || target)
            .focus();
    }
}

function renderGroup(group, path) {
    const id = path.join('-') || 'root';
    const add = (item, focus) => {
        group.conditions.push(item);
        render(focus + [...path, group.conditions.length - 1].join('-'));
        apply(0);
    };

    return h(
        'div',
        { className: path.length ? 'fb-group' : 'fb-root' },
        ...group.conditions.map((item, i) => renderRow(group, item, [
            ...path,
            i
        ])),
        !group.conditions.length && h('p', {
            className: 'fb-empty',
            textContent: 'No rules. Add a rule to filter the rows.'
        }),
        h(
            'div',
            { className: 'fb-actions' },
            h('button', {
                type: 'button',
                textContent: '+ Add rule',
                'aria-label': path.length ?
                    `Add rule to group ${path.map(i => i + 1).join('.')}` :
                    'Add rule',
                'data-key': `add-${id}`,
                onclick: () => add(newRule(), 'col-')
            }),
            // Groups are limited to one level of nesting.
            !path.length && h('button', {
                type: 'button',
                textContent: '+ Add group',
                onclick: () => add({
                    logic: 'or',
                    conditions: [newRule()]
                }, 'row-')
            })
        )
    );
}

function renderRow(group, item, path) {
    const index = path[path.length - 1];
    const id = path.join('-');
    const groupId = path.slice(0, -1).join('-') || 'root';
    const name = (item.conditions ? 'Group ' : 'Rule ') +
        path.map(i => i + 1).join('.');
    const logic = group.logic || 'and';
    let prefix;

    if (index === 1) {
        prefix = h(
            'select',
            {
                className: 'fb-prefix',
                'aria-label': 'Combine rules with',
                'data-key': `logic-${groupId}`,
                onchange: e => {
                    group.logic = e.target.value;
                    render(`logic-${groupId}`);
                    apply(0);
                }
            },
            ...['and', 'or'].map(value => h('option', {
                value,
                textContent: value,
                selected: value === logic
            }))
        );
    } else {
        prefix = h('span', {
            className: 'fb-prefix',
            textContent: index ? logic : 'Where'
        });
    }

    return h(
        'div',
        {
            className: 'fb-row',
            role: 'group',
            'aria-label': name,
            'data-key': `row-${id}`
        },
        prefix,
        item.conditions ?
            renderGroup(item, path) :
            renderRule(item, id),
        h('button', {
            type: 'button',
            className: 'fb-remove',
            textContent: '×',
            'aria-label': `Remove ${name.toLowerCase()}`,
            onclick: () => {
                group.conditions.splice(index, 1);

                const next = Math.min(index, group.conditions.length - 1);
                const nextPath = [...path.slice(0, -1), next].join('-');

                render(next < 0 ? `add-${groupId}` : `row-${nextPath}`);
                apply(0);
            }
        })
    );
}

function renderRule(rule, id) {
    const field = fieldMap[rule.columnId];
    const select = (key, label, options, value, onchange) => h(
        'select',
        {
            'aria-label': label,
            'data-key': `${key}-${id}`,
            onchange: e => {
                onchange(e.target.value);
                render(`${key}-${id}`);
                apply(0);
            }
        },
        ...options.map(([optionValue, textContent]) => h('option', {
            value: optionValue,
            textContent,
            selected: optionValue === value
        }))
    );

    return h(
        'div',
        { className: 'fb-rule' },
        select(
            'col',
            'Column',
            fields.map(f => [f.id, f.label]),
            rule.columnId,
            value => {
                delete rule.value;
                rule.columnId = value;
                setOperator(rule, operators[fieldMap[value].type][0]);
            }
        ),
        select(
            'op',
            'Operator',
            operators[field.type].map(op => [op, operatorLabel(field, op)]),
            rule.operator,
            value => setOperator(rule, value)
        ),
        !noValueOperators.includes(rule.operator) && h('input', {
            type: { number: 'number', datetime: 'date' }[field.type] || 'text',
            value: toInputValue(field, rule.value),
            placeholder: 'Value...',
            'aria-label': 'Value',
            oninput: e => {
                rule.value = fromInputValue(field, e.target.value);
                apply(300);
            }
        })
    );
}

Grid.grid('container', {
    gridKey: 'YOUR-GRID-KEY-HERE',
    data: {
        columns: Object.fromEntries(fields.map(f => [f.id, f.values]))
    },
    columnDefaults: {
        filtering: {
            enabled: true
        },
        minWidth: 120
    },
    columns: fields.map(f => ({
        id: f.id,
        dataType: f.type,
        header: { format: f.label },
        cells: f.cells
    })),
    filtering: {
        conditions: [{
            columnId: 'salary',
            operator: 'greaterThan',
            value: 70000
        }, {
            logic: 'or',
            conditions: [{
                columnId: 'country',
                operator: 'equals',
                value: 'Poland'
            }, {
                columnId: 'country',
                operator: 'equals',
                value: 'Norway'
            }]
        }]
    }
}, true).then(instance => {
    grid = instance;
    state = JSON.parse(JSON.stringify(
        grid.getOptions().filtering || { conditions: [] }
    ));

    ui.clear.onclick = () => {
        state = { conditions: [] };
        render('add-root');
        apply(0);
    };

    render();
    updateStatus();
});

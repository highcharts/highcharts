Grid.grid('container', {
    data: {
        columns: {
            name: [
                'Alice Nguyen', 'Bob Berg', 'Charlie Dupont', 'David Sato',
                'Eve Shaw', 'John Hale', 'Jane Ortiz', 'Jim Novak',
                'Jill Meyer', 'Jack Quinn', 'Nora Ellis', 'Omar Khan',
                'Priya Shah', 'Quinn Blake', 'Ruth Adler', 'Sam Okonkwo',
                'Tina Rossi', 'Uma Patel', 'Victor Lang', 'Wendy Cho'
            ],
            age: [
                23, 34, 45, 56, 67, 30, 25, 35, 40, 45,
                28, 31, 39, 42, 51, 27, 33, 36, 44, 48
            ],
            city: [
                'New York', 'Oslo', 'Paris', 'Tokyo', 'London',
                'New York', 'Oslo', 'Paris', 'Tokyo', 'London',
                'Berlin', 'Toronto', 'Mumbai', 'Sydney', 'Zurich',
                'Lagos', 'Rome', 'Lisbon', 'Seoul', 'Chicago'
            ],
            salary: [
                50000, 60000, 70000, 80000, 90000,
                40000, 35000, 45000, 50000, 55000,
                62000, 71000, 48000, 53000, 88000,
                41000, 59000, 64000, 76000, 82000
            ]
        }
    },
    rendering: {
        theme: '',
        table: {
            className: 'w-full border border-slate-200 rounded-md'
        },
        rows: {
            className: 'hover:bg-slate-50',
            evenClassName: 'bg-slate-50/50'
        }
    },
    caption: {
        text: 'Team directory',
        className: `mb-2 pt-2 pb-1 text-2xl font-semibold tracking-tight
            text-slate-900`
    },
    description: {
        text: 'Filter, sort, and page through sample employee rows styled ' +
            'with utility classes.',
        className: 'mb-2 pt-1 pb-4 text-sm text-slate-500'
    },
    columnDefaults: {
        dataType: 'string',
        sorting: {
            enabled: true
        },
        filtering: {
            enabled: true
        },
        header: {
            format: '{id}',
            className: `p-4 border-b border-r border-slate-200 font-semibold
                bg-slate-50 text-slate-700`
        },
        cells: {
            format: '{value}',
            className: 'p-4 border-b border-r border-slate-200 text-slate-600'
        }
    },
    header: [
        'name',
        {
            format: 'Details',
            className: 'hcg-center',
            columns: ['age', 'city', 'salary']
        }
    ],
    columns: [{
        id: 'name',
        header: {
            format: 'Name'
        },
        cells: {
            className:
                'p-4 border-b border-r border-slate-200 font-semibold ' +
                'text-slate-900'
        },
        sorting: {
            order: 'asc',
            priority: 0
        }
    }, {
        id: 'age',
        dataType: 'number',
        header: {
            format: 'Age ({id})'
        }
    }, {
        id: 'city',
        width: '20%',
        header: {
            formatter: function () {
                return 'City: ' + this.id;
            }
        }
    }, {
        id: 'salary',
        dataType: 'number',
        header: {
            format: 'Salary (USD)',
            className:
                'p-4 border-b border-r border-slate-200 font-semibold ' +
                'bg-slate-50 text-slate-700 text-right tabular-nums'
        },
        cells: {
            format: '${value}',
            className:
                'p-4 border-b border-r border-slate-200 text-slate-600 ' +
                'text-right tabular-nums'
        }
    }],
    pagination: {
        enabled: true,
        page: 1,
        pageSize: 5,
        className: 'mt-2 pt-2 pb-1',
        controls: {
            className: 'gap-2 border-l border-r border-slate-200',
            pageInfo: {
                className: 'font-semibold text-sm text-slate-700'
            },
            pageSizeSelector: {
                enabled: true,
                options: [5, 10, 25],
                className: 'demo-pag-size gap-2 text-sm text-slate-700'
            },
            pageButtons: {
                enabled: true,
                count: 5
            }
        }
    }
});

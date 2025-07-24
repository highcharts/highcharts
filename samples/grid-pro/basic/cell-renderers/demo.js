/* eslint-disable camelcase */

Grid.grid('container', {
    dataTable: {
        columns: {
            text_checkbox: [true, false, true, false, true, false, true],
            checkbox_checkbox: [true, false, true, false, true, false, true],
            text_textInput: [
                'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta'
            ],
            textInput_textInput: [
                'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta'
            ],
            text_select: ['R', 'B', 'G', 'B', 'G', 'R', 'B'],
            select_select: ['R', 'B', 'G', 'B', 'G', 'R', 'B'],
            text_date: [
                Date.UTC(2023, 0, 1), Date.UTC(2023, 0, 2),
                Date.UTC(2023, 0, 3), Date.UTC(2023, 0, 4),
                Date.UTC(2023, 0, 5), Date.UTC(2023, 0, 6),
                Date.UTC(2023, 0, 7)
            ],
            date_date: [
                Date.UTC(2023, 0, 1), Date.UTC(2023, 0, 2),
                Date.UTC(2023, 0, 3), Date.UTC(2023, 0, 4),
                Date.UTC(2023, 0, 5), Date.UTC(2023, 0, 6),
                Date.UTC(2023, 0, 7)
            ]
        }
    },
    columnDefaults: {
        cells: {
            editMode: {
                enabled: true
            }
        }
    },
    columns: [{
        id: 'text_checkbox',
        cells: {
            renderer: {
                type: 'text'
            },
            editMode: {
                renderer: {
                    type: 'checkbox'
                }
            }
        }
    }, {
        id: 'checkbox_checkbox',
        cells: {
            renderer: {
                type: 'checkbox'
            }
        }
    }, {
        id: 'text_textInput'
    }, {
        id: 'textInput_textInput',
        cells: {
            renderer: {
                type: 'textInput'
            }
        }
    }, {
        id: 'text_select',
        cells: {
            formatter: function () {
                const map = {
                    R: '🔴',
                    G: '🟢',
                    B: '🔵',
                    Y: '🟡'
                };
                return map[this.value] || '';
            },
            editMode: {
                renderer: {
                    type: 'select',
                    options: [
                        { value: 'R', label: 'Red' },
                        { value: 'B', label: 'Blue' },
                        { value: 'G', label: 'Green' },
                        { value: 'Y', label: 'Yellow' }
                    ]
                }
            }
        }
    }, {
        id: 'select_select',
        cells: {
            renderer: {
                type: 'select',
                options: [
                    { value: 'R', label: 'Red' },
                    { value: 'B', label: 'Blue' },
                    { value: 'G', label: 'Green' },
                    { value: 'Y', label: 'Yellow' }
                ]
            }
        }
    }, {
        id: 'text_date',
        dataType: 'datetime',
        cells: {
            format: '{value:%Y-%m-%d}',
            editMode: {
                renderer: {
                    type: 'dateInput'
                }
            }
        }
    }, {
        id: 'date_date',
        dataType: 'datetime',
        cells: {
            renderer: {
                type: 'dateInput'
            }
        }
    }]
});

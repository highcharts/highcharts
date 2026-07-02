/* eslint-disable camelcase */

Grid.grid('container', {
    data: {
        columns: {
            text_checkbox: [true, false, true, false, true, false, true],
            checkbox_checkbox: [true, false, true, false, true, false, true],
            text_textInput: [
                'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta'
            ],
            textInput_textInput: [
                'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta'
            ],
            text_numberInput: [1, 2, 3, 4, 5, 6, 7],
            numberInput_numberInput: [1, 2, 3, 4, 5, 6, 7],
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
                type: 'textInput',
                attributes: {
                    placeholder: 'Enter text'
                }
            }
        }
    }, {
        id: 'text_numberInput',
        cells: {
            editMode: {
                renderer: {
                    type: 'numberInput',
                    attributes: {
                        step: '1',
                        min: '0',
                        max: '10'
                    }
                }
            }
        }
    }, {
        id: 'numberInput_numberInput',
        dataType: 'number',
        cells: {
            renderer: {
                type: 'numberInput',
                attributes: {
                    step: '0.5',
                    min: '0',
                    max: '10'
                }
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

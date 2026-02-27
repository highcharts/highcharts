/* eslint-disable camelcase */

Grid.grid('container', {
    data: {
        columns: {
            text_checkbox: [true, false, true],
            checkbox_checkbox: [true, false, true],
            text_textInput: ['Alpha', 'Beta', 'Gamma'],
            textInput_textInput: ['Alpha', 'Beta', 'Gamma'],
            text_numberInput: [1, 2, 3],
            numberInput_numberInput: [1, 2, 3],
            text_select: ['R', 'B', 'G'],
            select_select: ['R', 'B', 'G'],
            text_date: [
                Date.UTC(2023, 0, 1), Date.UTC(2023, 0, 2), Date.UTC(2023, 0, 3)
            ],
            date_date: [
                Date.UTC(2023, 0, 1), Date.UTC(2023, 0, 2), Date.UTC(2023, 0, 3)
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
            format: '{value:%Y-%m-%d}',
            renderer: {
                type: 'dateInput'
            }
        }
    }]
});

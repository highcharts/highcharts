const changelog = document.querySelector('#changelog');

const grid = Grid.grid('container', {
    data: {
        columns: {
            id: [1, 2, 3, 4],
            product: ['Apples', 'Pears', 'Plums', 'Bananas'],
            available: [true, false, true, true],
            stock: [120, 85, 30, 200],
            price: [1.5, 2.53, 5, 4.5],
            country: ['PL', 'NL', 'RO', 'EC']
        }
    },
    accessibility: {
        screenReaderSection: {
            beforeGridFormat:
                '<div>{gridTitle}</div>' +
                '<div>{gridDescription}</div>' +
                '<div>Press Enter or double-click an editable cell to start ' +
                'editing.</div>',
            afterGridFormat:
                '<div>End of the editable fruit inventory grid.</div>'
        }
    },
    caption: {
        text: 'Editable fruit inventory'
    },
    description: {
        text: 'Editable stock, price, availability, and supplier columns ' +
            'with screen reader announcements for cell editing.'
    },
    lang: {
        accessibility: {
            cellEditing: {
                editable:
                    'Editable cell. Press Enter or double-click to change ' +
                    'the value.',
                announcements: {
                    started: 'Started editing the current cell.',
                    edited: 'Saved the new cell value.',
                    cancelled: 'Canceled cell editing.',
                    notValid: 'The new value is not valid.'
                }
            }
        },
        validationNotifications: {
            notEmpty: 'New value cannot be empty.',
            number: 'New value has to be a number.'
        }
    },
    rendering: {
        rows: {
            minVisibleRows: 4
        }
    },
    columnDefaults: {
        cells: {
            editMode: {
                enabled: true
            },
            events: {
                afterEdit: function () {
                    const entry = document.createElement('div');

                    entry.textContent = `${this.column.id} for ` +
                        `${this.row.data.product} was updated to ${
                            this.value
                        }.`;
                    changelog.append(entry);
                    changelog.scrollTop = changelog.scrollHeight;
                }
            }
        }
    },
    columns: [{
        id: 'id',
        cells: {
            editMode: {
                enabled: false
            }
        },
        width: 60
    }, {
        id: 'product',
        cells: {
            editMode: {
                enabled: false
            }
        }
    }, {
        id: 'available',
        dataType: 'boolean',
        cells: {
            format: '{#if value}Yes{else}No{/if}',
            editMode: {
                renderer: {
                    type: 'checkbox'
                }
            }
        }
    }, {
        id: 'stock',
        cells: {
            format: '{value} kg',
            editMode: {
                renderer: {
                    type: 'numberInput'
                },
                validationRules: ['notEmpty', 'number']
            }
        }
    }, {
        id: 'price',
        cells: {
            format: '{value:.2f} €',
            editMode: {
                renderer: {
                    type: 'numberInput'
                },
                validationRules: ['notEmpty', 'number']
            }
        }
    }, {
        id: 'country',
        header: {
            format: 'Supplier'
        },
        cells: {
            formatter: function () {
                const countryNames = {
                    PL: 'Poland',
                    NL: 'Netherlands',
                    RO: 'Romania',
                    EC: 'Ecuador'
                };

                return countryNames[this.value] || this.value;
            },
            editMode: {
                renderer: {
                    type: 'select',
                    options: [
                        { value: 'PL', label: 'Poland' },
                        { value: 'NL', label: 'Netherlands' },
                        { value: 'RO', label: 'Romania' },
                        { value: 'EC', label: 'Ecuador' }
                    ]
                }
            }
        }
    }]
});

const editorInputs = document.querySelectorAll('.editor input');

function getOptionValue(path) {
    let cursor = grid.options;

    for (const key of path.split('.')) {
        cursor = cursor?.[key];
    }

    return cursor;
}

function setOption(input) {
    const result = {};
    const path = input.name.split('.');
    let cursor = result;

    for (let i = 0, iEnd = path.length - 1; i < iEnd; i++) {
        cursor[path[i]] = cursor = {};
    }

    cursor[path[path.length - 1]] =
        input.type === 'checkbox' ? input.checked : input.value;

    grid.update(result);
}

function setInputValue(input) {
    const value = getOptionValue(input.name);

    if (input.type === 'checkbox') {
        input.checked = !!value;
    } else {
        input.value = value || '';
    }
}

for (const input of editorInputs) {
    setInputValue(input);

    input.addEventListener(
        input.type === 'checkbox' ? 'change' : 'input',
        () => {
            setOption(input);
        }
    );
}

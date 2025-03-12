const grid = Grid.grid('container', {
    dataTable: {
        columns: {
            id: ['1', '2', '3', '4'],
            product: ['Apples', 'Pears', 'Plums', 'Bananas'],
            weight: [100, 60, 30, 200],
            price: [1.5, 2.53, 5, 4.5]
        }
    },
    columnDefaults: {
        cells: {
            editable: true
        }
    },
    rendering: {
        rows: {
            minVisibleRows: 4
        }
    },
    caption: {
        text: 'Fruits Store'
    },
    credits: {
        text: 'Highcharts Grid Pro'
    },
    columns: [{
        id: 'id',
        header: {
            format: 'ID'
        },
        cells: {
            editable: false
        }
    }, {
        id: 'product',
        header: {
            format: 'Product Name'
        }
    }, {
        id: 'weight',
        header: {
            format: 'Weight'
        },
        cells: {
            format: '{value} g'
        }
    }, {
        id: 'price',
        header: {
            format: 'Price'
        },
        cells: {
            format: '{value:.2f} €'
        }
    }]
});

const languages = {
    en: {
        lang: {
            accessibility: {
                sorting: {
                    sortable: 'Sortable.',
                    announcements: {
                        ascending: 'Sorted ascending.',
                        descending: 'Sorted descending.',
                        none: 'Not sorted.'
                    }
                },
                cellEditing: {
                    editable: 'Editable.',
                    announcements: {
                        started: 'Entered cell editing mode.',
                        edited: 'Edited cell value.',
                        cancelled: 'Editing cancelled.'
                    }
                }
            }
        }
    },
    pl: {
        lang: {
            accessibility: {
                sorting: {
                    sortable: 'Sortowalne.',
                    announcements: {
                        ascending: 'Posortowano rosnąco.',
                        descending: 'Posortowano malejąco.',
                        none: 'Nie posortowano.'
                    }
                },
                cellEditing: {
                    editable: 'Edytowalne.',
                    announcements: {
                        started: 'Rozpoczeto edycję komórki.',
                        edited: 'Zmieniono wartość komórki.',
                        cancelled: 'Anulowano edycję.'
                    }
                }
            }
        }
    }
};

const editorInputs = document.querySelectorAll('.editor input');
const languageSelect = document.getElementById('lang-select');

function getOptionValue(path) {
    let cursor = grid.options;
    for (const key of path.split('.')) {
        cursor = cursor[key];
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
    cursor[path[path.length - 1]] = input.checked ?? input.value;
    grid.update(result);
}

function setInputValue(input) {
    const value = getOptionValue(input.name);
    if (input.type === 'checkbox') {
        input.checked = value;
    } else {
        input.value = value;
    }
}

function setLanguage(lang) {
    grid.update(languages[lang]);
    for (const input of editorInputs) {
        setInputValue(input);
    }
}

languageSelect.addEventListener('change', () => {
    setLanguage(languageSelect.value);
});

for (const input of editorInputs) {
    input.addEventListener('change', () => {
        setOption(input);

        if (input.name.split[0] === 'lang') {
            languageSelect.value = '-';
        }
    });
}

setLanguage('en');

const grid = Grid.grid('container', {
    dataTable: {
        columns: {
            id: ['1', '2', '3', '4'],
            productEN: ['Apple', 'Pear', 'Plum', 'Banana'],
            productNO: ['Eple', 'Pære', 'Plomme', 'Banan'],
            productPL: ['Jabłko', 'Gruszka', 'Śliwka', 'Banan'],
            productZH: ['苹果', '梨', '李子', '香蕉'],
            weight: [100, 60, 30, 200],
            price: [1.5, 2.53, 5, 4.5]
        }
    },
    rendering: {
        rows: {
            minVisibleRows: 4
        }
    },
    columns: [{
        id: 'id',
        header: {
            format: 'ID'
        }
    }, {
        id: 'weight',
        cells: {
            format: '{value} g'
        }
    }, {
        id: 'price',
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
                }
            },
            decimalPoint: '.'
        },
        header: ['id', 'productEN', 'weight', 'price'],
        columns: [{
            id: 'productEN',
            header: {
                format: 'Product'
            }
        }, {
            id: 'weight',
            header: {
                format: 'Weight'
            }
        }, {
            id: 'price',
            header: {
                format: 'Price'
            }
        }],
        caption: {
            text: 'Fruits Table - Internationalization Demo'
        }
    },
    no: {
        lang: {
            accessibility: {
                sorting: {
                    sortable: 'Sorterbar.',
                    announcements: {
                        ascending: 'Sortert stigende.',
                        descending: 'Sortert synkende.',
                        none: 'Ikke sortert.'
                    }
                }
            },
            decimalPoint: ','
        },
        header: ['id', 'productNO', 'weight', 'price'],
        columns: [{
            id: 'productNO',
            header: {
                format: 'Produkt'
            }
        }, {
            id: 'weight',
            header: {
                format: 'Vekt'
            }
        }, {
            id: 'price',
            header: {
                format: 'Pris'
            }
        }],
        caption: {
            text: 'Frukttabell - Internasjonaliseringsdemo'
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
                }
            },
            decimalPoint: ','
        },
        header: ['id', 'productPL', 'weight', 'price'],
        columns: [{
            id: 'productPL',
            header: {
                format: 'Produkt'
            }
        }, {
            id: 'weight',
            header: {
                format: 'Waga'
            }
        }, {
            id: 'price',
            header: {
                format: 'Cena'
            }
        }],
        caption: {
            text: 'Tabela Owoców - Demo internacjonalizacji'
        }
    },
    zh: {
        lang: {
            accessibility: {
                sorting: {
                    sortable: '可排序。',
                    announcements: {
                        ascending: '已按升序排序。',
                        descending: '已按降序排序。',
                        none: '未排序。'
                    }
                }
            },
            decimalPoint: '.'
        },
        header: ['id', 'productZH', 'weight', 'price'],
        columns: [{
            id: 'productZH',
            header: {
                format: '产品'
            }
        }, {
            id: 'weight',
            header: {
                format: '重量'
            }
        }, {
            id: 'price',
            header: {
                format: '价格'
            }
        }],
        caption: {
            text: '水果表 - 国际化演示'
        }
    }
};

const languageSelect = document.getElementById('lang-select');

function setLanguage(lang) {
    grid.update(languages[lang]);
    grid.container.setAttribute('lang', lang);
    grid.container.setAttribute('aria-lang', lang);
}

languageSelect.addEventListener('change', () => {
    setLanguage(languageSelect.value);
});

setLanguage('en');

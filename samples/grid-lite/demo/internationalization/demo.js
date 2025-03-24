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
            text: 'Fruits weight and price'
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
            text: 'Frukters vekt og pris'
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
            text: 'Waga i cena owoców'
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
            text: '水果的重量和价格'
        }
    }
};

const grid = Grid.grid('container', {
    lang: languages.en.lang,
    caption: languages.en.caption,
    header: languages.en.header,
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
    columns: [{
        id: 'id',
        header: {
            format: 'ID'
        }
    }, {
        id: 'productEN',
        header: {
            format: 'Product'
        }
    }, {
        id: 'weight',
        cells: {
            format: '{value} g'
        },
        header: {
            format: 'Weight'
        }
    }, {
        id: 'price',
        cells: {
            format: '{value:.2f} €'
        },
        header: {
            format: 'Price'
        }
    }]
});

const languageSelect = document.getElementById('lang-select');
const languageSpan = document.getElementById('lang-span');
const uiTranslations = {
    en: 'Language',
    no: 'Språk',
    pl: 'Język',
    zh: '语言'
};

function setLanguage(lang) {
    grid.update(languages[lang]);
    grid.container.setAttribute('lang', lang);
    grid.container.setAttribute('aria-lang', lang);
    languageSpan.textContent = `${uiTranslations[lang]}:`;
}

languageSelect.addEventListener('change', () => {
    setLanguage(languageSelect.value);
});

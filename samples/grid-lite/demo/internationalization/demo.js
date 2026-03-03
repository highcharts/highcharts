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
            locale: 'en'
        },
        header: ['id', 'productEN', 'weight', 'price', 'updated'],
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
        }, {
            id: 'updated',
            header: {
                format: 'Updated'
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
                },
                filtering: {
                    announcements: {
                        filterApplied: 'Filter brukt for {columnId}, ' +
                            '{condition} {value}. {rowsCount} resultater ' +
                            'funnet.',
                        emptyFilterApplied: 'Filter brukt for {columnId}, ' +
                            '{condition} verdier. {rowsCount} resultater ' +
                            'funnet.',
                        filterCleared: 'Filter fjernet for {columnId}. ' +
                            '{rowsCount} resultater funnet.'
                    }
                }
            },
            locale: 'no'
        },
        header: ['id', 'productNO', 'weight', 'price', 'updated'],
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
        }, {
            id: 'updated',
            header: {
                format: 'Oppdatert'
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
                },
                filtering: {
                    announcements: {
                        filterApplied: 'Zastosowano filtr dla {columnId}, ' +
                            '{condition} {value}. Znaleziono {rowsCount} ' +
                            'wyników.',
                        emptyFilterApplied: 'Zastosowano filtr dla ' +
                            '{columnId}, {condition} wartości. Znaleziono ' +
                            '{rowsCount} wyników.',
                        filterCleared: 'Wyczyszczono filtr dla {columnId}.' +
                            'Znaleziono {rowsCount} wyników.'
                    }
                }
            },
            locale: 'pl'
        },
        header: ['id', 'productPL', 'weight', 'price', 'updated'],
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
        }, {
            id: 'updated',
            header: {
                format: 'Zaktualizowano'
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
                },
                filtering: {
                    announcements: {
                        filterApplied: '已为 {columnId} 应用筛选器,' +
                            '{condition} {value}。找到 {rowsCount} 个结果。',
                        emptyFilterApplied: '已为 {columnId} 应用筛选器,' +
                            '{condition} 值。找到 {rowsCount} 个结果。',
                        filterCleared: '已清除 {columnId} 的筛选器。' +
                            '找到 {rowsCount} 个结果。'
                    }
                }
            },
            locale: 'zh'
        },
        header: ['id', 'productZH', 'weight', 'price', 'updated'],
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
        }, {
            id: 'updated',
            header: {
                format: '最新的'
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
            id: [1, 2, 3, 4],
            productEN: ['Apple', 'Pear', 'Plum', 'Banana'],
            productNO: ['Eple', 'Pære', 'Plomme', 'Banan'],
            productPL: ['Jabłko', 'Gruszka', 'Śliwka', 'Banan'],
            productZH: ['苹果', '梨', '李子', '香蕉'],
            weight: [100, 60, 30, 200],
            price: [1.5, 2.53, 5, 4.5],
            updated: [
                Date.UTC(2025, 2, 15), Date.UTC(2025, 5, 23),
                Date.UTC(2025, 4, 16), Date.UTC(2025, 6, 5)
            ]
        }
    },
    columns: [{
        id: 'id',
        header: {
            format: 'ID'
        },
        width: 60
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
    }, {
        id: 'updated',
        cells: {
            format: '{value:%[ebY]}'
        },
        header: {
            format: 'Updated'
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

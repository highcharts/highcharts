const doc = document;

Grid.grid('container', {
    dataTable: {
        columns: {
            product: ['Apples', 'Pears', 'Plums', 'Bananas'],
            weight: [100, 40, 0.5, 200],
            price: [1.5, 2.53, 5, 4.5],
            metaData: ['a', 'b', 'c', 'd']
        }
    },
    columnDefaults: {
        filtering: {
            enabled: true,
            inline: true
        },
        events: {
            beforeSort: function () {
                doc.getElementById('beforeColumnSorting').value = 'beforeSort';
            },
            afterSort: function () {
                doc.getElementById('afterColumnSorting').value = 'afterSort';
            },
            beforeFilter: function () {
                doc.getElementById('beforeColumnFiltering').value =
                    'beforeFilter';
            },
            afterFilter: function () {
                doc.getElementById('afterColumnFiltering').value =
                    'afterFilter';
            },
            afterResize: function () {
                doc.getElementById('columnResizing').value = 'columnResizing';
            }
        },
        cells: {
            editMode: {
                enabled: true
            },
            events: {
                click: function () {
                    doc.getElementById('cellClick').value = 'cellClick';
                },
                dblClick: function () {
                    doc.getElementById('cellDblClick').value = 'cellDblClick';
                },
                mouseOver: function () {
                    doc.getElementById('cellMouseOver').value = 'cellMouseOver';
                },
                mouseOut: function () {
                    doc.getElementById('cellMouseOut').value = 'cellMouseOut';
                },
                afterEdit: function () {
                    doc.getElementById('cellAfterEdit').value = 'cellAfterEdit';
                },
                afterRender: function () {
                    if (this.row.index !== 1 || this.column.id !== 'weight') {
                        return;
                    }
                    const el = doc.getElementById('cellAfterRender');
                    console.log(this.row.index, this.column.id);
                    const counter = +el.value;
                    el.value = counter + 1;
                }
            }
        },
        header: {
            events: {
                click: function () {
                    doc.getElementById('headerClick').value = 'headerClick';
                },
                afterRender: function () {
                    doc.getElementById('headerAfterRender').value =
                        'afterRender';
                }
            }
        }
    },
    columns: [{
        id: 'weight',
        events: {
            beforeSort: function () {
                doc.getElementById('beforeColumnSorting').value =
                    'beforeSortColumnOption';
            },
            afterSort: function () {
                doc.getElementById('afterColumnSorting').value =
                    'afterSortColumnOption';
            },
            beforeFilter: function () {
                doc.getElementById('beforeColumnFiltering').value =
                    'beforeFilterColumnOption';
            },
            afterFilter: function () {
                doc.getElementById('afterColumnFiltering').value =
                    'afterFilterColumnOption';
            },
            afterResize: function () {
                doc.getElementById('columnResizing').value =
                    'columnResizingColumnOption';
            }
        },
        cells: {
            editMode: {
                enabled: true
            },
            events: {
                click: function () {
                    doc.getElementById('cellClick').value =
                        'cellClickColumnOption';
                },
                dblClick: function () {
                    doc.getElementById('cellDblClick').value =
                        'cellDblClickColumnOption';
                },
                mouseOver: function () {
                    doc.getElementById('cellMouseOver').value =
                        'cellMouseOverColumnOption';
                },
                mouseOut: function () {
                    doc.getElementById('cellMouseOut').value =
                        'cellMouseOutColumnOption';
                },
                afterRender: function () {
                    if (this.row.index !== 1 || this.column.id !== 'weight') {
                        return;
                    }
                    const el = doc.getElementById('cellAfterRender');
                    console.log(this.row.index, this.column.id);
                    const counter = +el.value;
                    el.value = counter + 1;
                }
            }
        },
        header: {
            events: {
                click: function () {
                    doc.getElementById('headerClick').value =
                        'headerClickColumnOption';
                }
            }
        }
    }],
    // Deprecated
    events: {
        cell: {
            click: function () {
                doc.getElementById('cellClick').value = 'cellClick';
            },
            dblClick: function () {
                doc.getElementById('cellDblClick').value = 'cellDblClick';
            },
            mouseOver: function () {
                doc.getElementById('cellMouseOver').value = 'cellMouseOver';
            },
            mouseOut: function () {
                doc.getElementById('cellMouseOut').value = 'cellMouseOut';
            },
            afterRender: function () {
                if (this.row.index !== 1 || this.column.id !== 'weight') {
                    return;
                }
                const el = doc.getElementById('cellAfterRender');
                console.log(this.row.index, this.column.id);
                const counter = +el.value;
                el.value = counter + 1;
            }
        },
        column: {
            afterSort: function () {
                doc.getElementById('columnSorting').value = 'afterSort';
            },
            afterResize: function () {
                doc.getElementById('columnResizing').value = 'columnResizing';
            }
        },
        header: {
            click: function () {
                doc.getElementById('headerClick').value = 'headerClick';
            }
        }
    }
});

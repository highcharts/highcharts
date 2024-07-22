const doc = document;

DataGrid.dataGrid('container', {
    table: {
        columns: {
            product: ['Apples', 'Pears', 'Plums', 'Bananas'],
            weight: [100, 40, 0.5, 200],
            price: [1.5, 2.53, 5, 4.5],
            metaData: ['a', 'b', 'c', 'd']
        }
    },
    defaults: {
        columns: {
            editable: true,
            sorting: true
        }
    },
    columns: {
        product: {
            editable: true,
            events: {
                afterSorting: function () {
                    doc.getElementById('columnSorting').value = 'afterSorting';
                }
            }
        }
    },
    events: {
        cell: {
            click: function () {
                doc.getElementById('cellClick').value = 'cellClick';
            },
            mouseOver: function () {
                doc.getElementById('cellMouseOver').value = 'cellMouseOver';
            },
            mouseOut: function () {
                doc.getElementById('cellMouseOut').value = 'cellMouseOut';
            },
            afterEdit: function () {
                doc.getElementById('cellAfterEdit').value = 'cellAfterEdit';
            }
        }
    }
});

const msg = document.getElementById('msg');

Grid.grid('container', {
    dataTable: {
        columns: {
            product: ['Apples', 'Pears', 'Plums', 'Bananas'],
            weight: [100, 40, 0.5, 200],
            price: [1.5, 2.53, 5, 4.5],
            metaData: ['a', 'b', 'c', 'd'],
            icon: ['Apples URL', 'Pears URL', 'Plums URL', 'Bananas URL']
        }
    },
    columnDefaults: {
        cells: {
            events: {
                afterRender: function () {
                    msg.innerText = `Edited a cell in the ${this.row.index} ` +
                        ` row and the '${this.column.id}' column.`;
                },
                click: function () {
                    msg.innerText = 'Clicked on a cell with value ' +
                        `'${this.value}', in the column '${this.column.id}'.`;
                },
                dblClick: function () {
                    msg.innerText = 'Double clicked on a cell with value ' +
                        `'${this.value}', in the column '${this.column.id}'.`;
                },
                mouseOver: function () {
                    msg.innerText = 'Hovered a cell with value' +
                        `'${this.value}', in the column '${this.column.id}'.`;
                },
                mouseOut: function () {
                    msg.innerText = 'Unhovered a cell with value ' +
                        `'${this.value}', in the column '${this.column.id}'.`;
                }
            }
        },
        events: {
            afterResize: function () {
                msg.innerText = `Resized the column '${this.id}' to ` +
                    `${Math.round(this.width * 1000) / 10}%.`;
            },
            afterSorting: function () {
                const { order } =
                    this.viewport.grid.querying.sorting.currentSorting;

                switch (order) {
                case 'asc':
                    msg.innerText += ' Sorted in ascending order.';
                    break;
                case 'desc':
                    msg.innerText += ' Sorted in descending order.';
                    break;
                default:
                    msg.innerText += ' Unsorted.';
                }
            }
        },
        header: {
            events: {
                click: function () {
                    msg.innerText =
                        `Clicked the header of the column '${this.id}'.`;
                }
            }
        }
    },
    columns: [{
        id: 'product',
        header: {
            format: 'Product (editable)'
        },
        cells: {
            editable: true
        }
    }, {
        id: 'metaData',
        header: {
            format: 'MetaData (unsortable)'
        },
        sorting: {
            sortable: false
        }
    }]
});

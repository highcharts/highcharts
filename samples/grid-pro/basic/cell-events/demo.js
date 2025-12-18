const msgMouse = document.getElementById('msg-mouse');
const msgTable = document.getElementById('msg-table');

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
                afterEdit: function () {
                    msgTable.innerText = 'Edited a cell in the ' +
                        ` ${this.row.index} row and the '${this.column.id}' ` +
                        'column.';
                },
                afterRender: function () {
                    msgTable.innerText = 'Rendered a cell in the ' +
                        ` ${this.row.index} row and the '${this.column.id}' ` +
                        'column.';
                },
                click: function () {
                    msgMouse.innerText = 'Clicked on a cell with value ' +
                        `'${this.value}', in the column '${this.column.id}'.`;
                },
                dblClick: function () {
                    msgMouse.innerText = 'Double clicked on a cell with value' +
                        ` '${this.value}', in the column '${this.column.id}'.`;
                },
                mouseOver: function () {
                    msgMouse.innerText = 'Hovered a cell with value ' +
                        `'${this.value}', in the column '${this.column.id}'.`;
                },
                mouseOut: function () {
                    msgMouse.innerText = 'Unhovered a cell with value ' +
                        `'${this.value}', in the column '${this.column.id}'.`;
                }
            }
        },
        events: {
            afterResize: function () {
                msgTable.innerText = `Resized the column '${this.id}' to ` +
                    `${Math.round(this.width * 1000) / 10}%.`;
            },
            beforeSort: function () {
                msgTable.innerText = 'Before sorting the column ' +
                    `'${this.id}'.`;
            },
            afterSort: function () {
                const { order } =
                    this.viewport.grid.querying.sorting.currentSorting;

                switch (order) {
                case 'asc':
                    msgTable.innerText += ' Sorted in ascending order.';
                    break;
                case 'desc':
                    msgTable.innerText += ' Sorted in descending order.';
                    break;
                default:
                    msgTable.innerText += ' Unsorted.';
                }
            },
            beforeFilter: function () {
                msgTable.innerText = 'Before filtering the column ' +
                    `'${this.id}'.`;
            },
            afterFilter: function () {
                msgTable.innerText = 'After filtering the column ' +
                    `'${this.id}'.`;
            }
        },
        header: {
            events: {
                click: function () {
                    msgTable.innerText =
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
            editMode: {
                enabled: true
            }
        }
    }, {
        id: 'metaData',
        header: {
            format: 'MetaData (unsortable)'
        },
        sorting: {
            enabled: false
        }
    }]
});

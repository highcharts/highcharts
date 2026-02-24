const doc = document;

// Generate enough rows to trigger virtualization
function generateData(rowCount) {
    const products = [];
    const weights = [];
    for (let i = 0; i < rowCount; i++) {
        products.push('Product ' + i);
        weights.push(Math.floor(Math.random() * 1000));
    }
    return { product: products, weight: weights };
}

window.grid = Grid.grid('container', {
    dataTable: {
        columns: generateData(200)
    },
    columnDefaults: {
        cells: {
            events: {
                click: function () {
                    doc.getElementById('cellClick').value = 'clicked';
                    doc.getElementById('lastClickedRow').value = this.row.index;
                },
                mouseOver: function () {
                    doc.getElementById('cellMouseOver').value =
                        'row-' + this.row.index;
                }
            }
        }
    }
});

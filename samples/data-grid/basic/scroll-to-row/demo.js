const dataGrid = new DataGrid.DataGrid('container', {
    table: {
        columns: {
            a: Array.from({ length: 1000 }, (_, i) => `A${i} lorem ipsum`),
            b: Array.from({ length: 1000 }, (_, i) =>
                `B${i} long text test lorem ipsum dolor sit amet, consectetur`
            ),
            c: Array.from({ length: 1000 }, (_, i) => `C${i}`),
            d: Array.from({ length: 1000 }, (_, i) => `D${i}`),
            'lorem ipsum': Array.from({ length: 1000 }, (_, i) => `E${i}`),
            f: Array.from({ length: 1000 }, (_, i) => `F${i}`)
        }
    },
    caption: {
        text: 'Title of the new Datagrid.'
    },
    settings: {
        rows: {
            bufferSize: 5
        }
    },
    defaults: {
        columns: {
            headerFormat: 'Col-{id}',
            cellFormat: 'V: {value}'
        }
    },
    columns: {
        d: {
            headerFormat: 'Col D',
            cellFormat: '{row.index}%'
        }
    }
});

document.getElementById('scroll').addEventListener('submit', e => {
    e.preventDefault();
    const value = +e.target.elements['row-to-scroll'].value;
    if (!isNaN(value)) {
        dataGrid.viewport.scrollToRow(value);
    }
});

console.log(dataGrid);

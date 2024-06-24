const dg = new DataGrid.DataGrid2('container', {
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
    rows: {
        bufferSize: 5
    },
    title: {
        text: 'Title of the new Datagrid.'
    },
    settings: {
        rowBufferSize: 5
    },
    defaults: {
        columns: {
            headFormat: 'Col-{id}',
            cellFormat: 'V: {value}'
        }
    },
    columns: {
        d: {
            headFormat: 'Col D',
            cellFormat: '{row.index}%'
        }
    }
});

document.getElementById('scroll').addEventListener('submit', e => {
    e.preventDefault();
    const value = +e.target.elements['row-to-scroll'].value;
    if (!isNaN(value)) {
        dg.viewport.scrollToRow(value);
    }
});

console.log(dg);

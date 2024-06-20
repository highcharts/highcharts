const dg = new DataGrid.DataGrid2('container', {
    table: {
        columns: {
            a: Array.from({ length: 1000 }, (_, i) => `A${i} loreum ipsum et`),
            b: Array.from({ length: 1000 }, (_, i) => `B${i} long text test loreum ipsum et omnia dolores test width and height`), // eslint-disable-line
            c: Array.from({ length: 1000 }, (_, i) => `C${i}`),
            d: Array.from({ length: 1000 }, (_, i) => `D${i}`),
            'loreum ipsum': Array.from({ length: 1000 }, (_, i) => `E${i}`), // eslint-disable-line
            f: Array.from({ length: 1000 }, (_, i) => `F${i}`)
        }
    },
    rows: {
        bufferSize: 5
    },
    title: {
        text: 'Loreum ipsum et omnia dolores Loreum ipsum et omnia dolores Loreum ipsum et omnia dolores Loreum ipsum et omnia dolores Loreum ipsum et omnia dolores Loreum ipsum et omnia dolores' // eslint-disable-line
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

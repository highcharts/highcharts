const dg = new DataGrid.DataGrid2('container', {
    dataTable: new DataGrid.DataTable({
        columns: {
            a: Array.from({ length: 1000 }, (_, i) => `A${i} loreum ipsum et`),
            b: Array.from({ length: 1000 }, (_, i) => `B${i} long text test loreum ipsum et omnia dolores test width and height`), // eslint-disable-line
            c: Array.from({ length: 1000 }, (_, i) => `C${i}`),
            d: Array.from({ length: 1000 }, (_, i) => `D${i}`),
            'loreum ipsum et omnia dolors loreum ipsum et omnia dolors': Array.from({ length: 1000 }, (_, i) => `E${i}`), // eslint-disable-line
            f: Array.from({ length: 1000 }, (_, i) => `F${i}`)
        }
    }),
    rows: {
        bufferSize: 5
    },
    columns: {
        options: {
            name: 'General: ',
            cellFormat: 'Value: {this.value}'
        },
        columnAssignment: [{
            columnId: 'a'
        }, {
            columnId: 'b',
            options: {
                name: 'column B',
                cellFormat: '{this.value}%'
            }
        }]
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

const dg = new DataGrid.DataGrid2('container', {
    dataTable: new DataGrid.DataTable({
        columns: {
            a: Array.from({ length: 10e4 }, (_, i) => `A${i}`),
            b: Array.from({ length: 10e4 }, (_, i) => `B${i}`),
            c: Array.from({ length: 10e4 }, (_, i) => `C${i}`),
            d: Array.from({ length: 10e4 }, (_, i) => `D${i}`),
            e: Array.from({ length: 10e4 }, (_, i) => `E${i}`),
            f: Array.from({ length: 10e4 }, (_, i) => `F${i}`)
        }
    })
});

document.getElementById('scroll').addEventListener('submit', e => {
    e.preventDefault();
    const value = +e.target.elements['row-to-scroll'].value;
    if (!isNaN(value)) {
        dg.viewport.scrollToRow(value);
    }
});

console.log(dg);

const dg = new DataGrid.DataGrid2('container', {
    dataTable: {},
    rows: {
        bufferSize: 5
    },
    columns: {
        distribution: 'fixed'
    }
});

console.log(dg);

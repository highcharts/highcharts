const dg = DataGrid.dataGrid2('container', {
    dataTable: {},
    rows: {
        bufferSize: 5
    },
    columns: {
        distribution: 'fixed'
    }
});

console.log(dg);

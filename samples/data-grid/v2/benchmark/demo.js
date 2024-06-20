const oldDatagridTimer = document.querySelector('#render-old'),
    newDatagridTimer = document.querySelector('#render-new');

const dataTable = new DataGrid.DataTable({
    columns: {
        a: Array.from({ length: 10e4 }, (_, i) => `A${i}`),
        b: Array.from({ length: 10e4 }, (_, i) => `B${i}`),
        c: Array.from({ length: 10e4 }, (_, i) => `C${i}`),
        d: Array.from({ length: 10e4 }, (_, i) => `D${i}`),
        e: Array.from({ length: 10e4 }, (_, i) => `E${i}`),
        f: Array.from({ length: 10e4 }, (_, i) => `F${i}`)
    }
});

const startOldTime = new Date().getTime();
var t0 = performance.now();
// eslint-disable-next-line
const grid = new DataGrid.DataGrid('datagrid-old', {
    dataTable: dataTable
});
var t1 = performance.now();
const endOldTime = new Date().getTime();
oldDatagridTimer.innerHTML =
    'Time: ' + (endOldTime - startOldTime) + ' Perf: ' + (t1 - t0).toFixed(2);

// NEW
const startNewTime = new Date().getTime();
var t2 = performance.now();
// eslint-disable-next-line no-unused-vars
const newgrid = new DataGrid.DataGrid2('container', {
    table: dataTable,
    settings: {
        rowBufferSize: 5
    }
});
var t3 = performance.now();
const endNewTime = new Date().getTime();
newDatagridTimer.innerHTML =
    'Time: ' + (endNewTime - startNewTime) + ' Perf: ' + (t3 - t2).toFixed(2);

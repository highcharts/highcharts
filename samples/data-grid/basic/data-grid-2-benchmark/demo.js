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
// eslint-disable-next-line
const grid = new DataGrid.DataGrid('datagrid-old', {
    dataTable: dataTable
});
const endOldTime = new Date().getTime();
oldDatagridTimer.innerHTML = endOldTime - startOldTime;

// NEW
const startNewTime = new Date().getTime();
const newgrid = new DataGrid.DataGrid2('container', {
    dataTable: dataTable
});
const endNewTime = new Date().getTime();
newDatagridTimer.innerHTML = endNewTime - startNewTime;

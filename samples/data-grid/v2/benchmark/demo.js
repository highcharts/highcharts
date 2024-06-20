const oldDatagridTimer = document.querySelector('#render-old'),
    newDatagridTimerAH = document.querySelector('#render-new-ah'),
    newDatagridTimerSH = document.querySelector('#render-new-sh');

const dataTable = new DataGrid.DataTable({
    columns: {
        a: Array.from({ length: 10e4 }, (_, i) => `A${i}`),
        b: Array.from({ length: 10e4 }, (_, i) => `B${i}`),
        c: Array.from({ length: 10e4 }, (_, i) => `C${i} - longer text`),
        d: Array.from({ length: 10e4 }, (_, i) => `D${i}`),
        e: Array.from({ length: 10e4 }, (_, i) => `E${i}`),
        f: Array.from({ length: 10e4 }, (_, i) => `F${i}`)
    }
});

let startTime = new Date().getTime();
let startPerfo = performance.now();
// eslint-disable-next-line
const grid = new DataGrid.DataGrid('datagrid-old', {
    dataTable: dataTable
});
let endPerfo = performance.now();
let endTime = new Date().getTime();
oldDatagridTimer.innerHTML =
    'Time: ' + (endTime - startTime) +
    ' Perf: ' + (endPerfo - startPerfo).toFixed(2);

// NEW (autoheight)
startTime = new Date().getTime();
startPerfo = performance.now();
// eslint-disable-next-line no-unused-vars
const newGridAH = new DataGrid.DataGrid2('container-ah', {
    table: dataTable,
    settings: {
        rowBufferSize: 5
    }
});
endPerfo = performance.now();
endTime = new Date().getTime();
newDatagridTimerAH.innerHTML =
    'Time: ' + (endTime - startTime) +
    ' Perf: ' + (endPerfo - startPerfo).toFixed(2);

// NEW (strictheight)
startTime = new Date().getTime();
startPerfo = performance.now();
// eslint-disable-next-line no-unused-vars
const newGridSH = new DataGrid.DataGrid2('container-sh', {
    table: dataTable,
    settings: {
        rowBufferSize: 5,
        strictRowHeights: true
    }
});
endPerfo = performance.now();
endTime = new Date().getTime();
newDatagridTimerSH.innerHTML =
    'Time: ' + (endTime - startTime) +
    ' Perf: ' + (endPerfo - startPerfo).toFixed(2);

import DataGrid from '../../../../code/es-modules/DataGrid/DataGrid.js';
import DataTable from '../../../../code/es-modules/Data/DataTable.js';

const columns = (() => {
    const makeRandomRows = () => (new Array(60)).fill('').map(() => (10 * Math.random()).toFixed(2));
    const cols = {};
    const numCols = 6;
    for (let i = 0; i < numCols; ++i) {
        cols['column' + i] = makeRandomRows();
    }
    return cols;
})();

const grid = new DataGrid('container', {
    dataTable: new DataTable(columns)
});

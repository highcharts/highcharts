import DataGrid from '../../../../code/es-modules/DataGrid/DataGrid.js';
import DataTable from '../../../../code/es-modules/Data/DataTable.js';

const headers = ['Apples', 'Pears', 'Plums', 'Bananas', 'Oranges', 'Potatoes'];
const columns = (() => {
    const makeRandomRows = () => (new Array(60)).fill('').map(() => (10 * Math.random()).toFixed(2));
    const cols = {};
    for (let i = 0; i < headers.length; ++i) {
        cols[headers[i]] = makeRandomRows();
    }
    return cols;
})();

const grid = new DataGrid('container', {
    dataTable: new DataTable(columns)
});

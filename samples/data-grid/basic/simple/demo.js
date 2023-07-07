const { DataTable } = Dashboards;

const headers = ['Apples', 'Pears', 'Plums', 'Bananas', 'Oranges', 'Potatoes'];

const columns = (() => {
    const makeRandomRows = () => new Array(60).fill('').map((_, i) => {
        if (i === 0) {
            return 'first';
        }
        if (i === 59) {
            return 'last';
        }
        return (10 * Math.random()).toFixed(2);
    });
    const cols = {};
    for (let i = 0; i < headers.length; ++i) {
        cols[headers[i]] = makeRandomRows();
    }
    return cols;
})();

const grid = new DataGrid.DataGrid('container', {
    dataTable: new DataTable({ columns })
});

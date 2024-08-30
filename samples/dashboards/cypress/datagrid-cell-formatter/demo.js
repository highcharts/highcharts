const { DataTable } = Dashboards;

const columns = {
    date: [Date.UTC(2022, 0, 1)],
    product: ['Apples']
};

// eslint-disable-next-line
const grid = new DataGrid.DataGrid('container', {
    dataTable: new DataTable({ columns }),
    columns: {
        date: {
            cellFormatter: function () {
                return new Date(this.value)
                    .toISOString()
                    .substring(0, 10);
            }
        }
    }
});

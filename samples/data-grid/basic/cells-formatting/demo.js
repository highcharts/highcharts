const { DataTable } = Dashboards;

const columns = {
    Product: ['Apples', 'Pears', 'Plums', 'Bananas'],
    Weight: [100, 40, 0.5, 200],
    Price: [1.5, 2.53, 5, 4.5],
    SomeExtraColumnToHide: [1, 2, 3, 4]
};

const grid = new DataGrid.DataGrid('container', {
    dataTable: new DataTable({ columns })
});

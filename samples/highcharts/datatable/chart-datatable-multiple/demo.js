const dataTable1 = new Highcharts.DataTableCore({
    columns: {
        year: [2020, 2021, 2022, 2023],
        cost: [11, 13, 12, 14]
    }
});

const dataTable2 = new Highcharts.DataTableCore({
    columns: {
        year: [2020, 2021, 2022, 2023],
        revenue: [12, 15, 14, 18]
    }
});

Highcharts.chart('container', {
    dataTable: [dataTable1, dataTable2],
    chart: {
        type: 'column'
    },
    title: {
        text: 'Multiple data tables'
    },
    series: [{
        name: 'Cost',
        columnAssignment: [{
            dataTable: 0,
            key: 'x',
            columnName: 'year'
        }, {
            dataTable: 0,
            key: 'y',
            columnName: 'cost'
        }]
    }, {
        name: 'Revenue',
        columnAssignment: [{
            dataTable: 1,
            key: 'x',
            columnName: 'year'
        }, {
            dataTable: 1,
            key: 'y',
            columnName: 'revenue'
        }]
    }]
});

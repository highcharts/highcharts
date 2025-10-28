const dataTable1 = new Highcharts.DataTableCore({
    columns: {
        year: [2020, 2021, 2022, 2023]
    }
});

const dataTable2 = new Highcharts.DataTableCore({
    columns: {
        revenue: [12, 15, 14, 18]
    }
});

Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Multiple series-level data tables, one series'
    },
    series: [{
        name: 'Revenue',
        dataTable: [dataTable1, dataTable2],
        columnAssignment: [{
            dataTable: 0,
            key: 'x',
            columnName: 'year'
        }, {
            dataTable: 1,
            key: 'y',
            columnName: 'revenue'
        }]
    }]
});

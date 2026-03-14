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
        dataMapping: {
            x: {
                dataTable: 0,
                column: 'year'
            },
            y: {
                dataTable: 1,
                column: 'revenue'
            }
        }
    }]
});

const dataTable1 = new Highcharts.DataTable({
    columns: {
        Year: [2020, 2021, 2022, 2023]
    }
});

const dataTable2 = new Highcharts.DataTable({
    columns: {
        Revenue: [12, 15, 14, 18]
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
        dataTable: [dataTable1, dataTable2],
        dataMapping: {
            x: {
                dataTable: 0,
                column: 'Year'
            },
            y: {
                dataTable: 1,
                column: 'Revenue'
            }
        }
    }]
});

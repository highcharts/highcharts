const dataTable1 = new Highcharts.DataTable({
    columns: {
        Date: ['2026-05-04', '2026-05-05', '2026-05-06', '2026-05-07']
    }
});

const dataTable2 = new Highcharts.DataTable({
    columns: {
        Revenue: [12, 15, 14, 18]
    }
});

Highcharts.stockChart('container', {
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
                column: 'Date'
            },
            y: {
                dataTable: 1,
                column: 'Revenue'
            }
        }
    }]
});

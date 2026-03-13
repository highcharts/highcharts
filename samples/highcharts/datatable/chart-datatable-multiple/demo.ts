const dataTableA = new Highcharts.DataTableCore({
    columns: {
        year: [2020, 2021, 2022, 2023],
        cost: [11, 13, 12, 14]
    }
});

const dataTableB = new Highcharts.DataTableCore({
    columns: {
        year: [2020, 2021, 2022, 2023],
        revenue: [12, 15, 14, 18]
    }
});

Highcharts.chart('container', {
    dataTable: [dataTableA, dataTableB],
    chart: {
        type: 'column'
    },
    title: {
        text: 'Multiple data tables'
    },
    series: [{
        name: 'Cost',
        dataMapping: {
            x: {
                // dataTable: 0, // Optional, defaults to 0
                column: 'year'
            },
            y: {
                // dataTable: 0, // Optional, defaults to 0
                column: 'cost'
            }
        }
    }, {
        name: 'Revenue',
        dataMapping: {
            x: {
                dataTable: 1,
                column: 'year'
            },
            y: {
                dataTable: 1,
                column: 'revenue'
            }
        }
    }]
});

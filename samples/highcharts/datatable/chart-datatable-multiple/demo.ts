const dataTableA = new Highcharts.DataTable({
    columns: {
        Year: [2020, 2021, 2022, 2023],
        Cost: [11, 13, 12, 14]
    }
});

const dataTableB = new Highcharts.DataTable({
    columns: {
        Year: [2020, 2021, 2022, 2023],
        Revenue: [12, 15, 14, 18]
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
        dataMapping: {
            x: {
                // dataTable: 0, // Optional, defaults to 0
                column: 'Year'
            },
            y: {
                // dataTable: 0, // Optional, defaults to 0
                column: 'Cost'
            }
        }
    }, {
        dataMapping: {
            x: {
                dataTable: 1,
                column: 'Year'
            },
            y: {
                dataTable: 1,
                column: 'Revenue'
            }
        }
    }]
});

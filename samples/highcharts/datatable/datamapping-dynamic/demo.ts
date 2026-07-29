const dataTable = new Highcharts.DataTable({
    columns: {
        ExperimentNo: [1, 2, 3, 4, 5, 6, 7],
        Prediction: [11, 13, 12, 14, 15, 16, 17],
        Result: [12, 15, 14, 18, 19, 20, 21]
    }
});

Highcharts.chart('container', {
    dataTable,
    title: {
        text: 'Data mapping and dynamic updates'
    },
    plotOptions: {
        series: {
            dataMapping: {
                x: 'ExperimentNo'
            }
        }
    },
    series: [{
        dataMapping: {
            y: 'Prediction'
        },
        dashStyle: 'ShortDot'
    }, {
        dataMapping: {
            y: 'Result'
        }
    }]
});

// Simulate dynamic updates to the data table
setInterval(() => {
    dataTable.deleteRows(0);
    const lastExperimentNo = +dataTable.getColumn('ExperimentNo').slice(-1)[0];
    dataTable.setRow({
        ExperimentNo: lastExperimentNo + 1,
        Prediction: Math.round(10 + Math.random() * 10),
        Result: Math.round(10 + Math.random() * 10)
    });
}, 1000);
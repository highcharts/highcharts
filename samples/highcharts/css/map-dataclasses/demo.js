function drawChart(mapData, data) {
    return Highcharts.mapChart('container', {

        chart: {
            styledMode: true
        },

        title: {
            text: 'Named data classes'
        },

        mapNavigation: {
            enabled: true
        },

        legend: {
            title: {
                text: 'Population density'
            },
            align: 'left',
            verticalAlign: 'bottom',
            floating: true,
            layout: 'vertical',
            valueDecimals: 0,
            symbolRadius: 0,
            symbolHeight: 14
        },

        colorAxis: {
            dataClassColor: 'category',
            dataClasses: [{
                to: 20,
                name: 'Sparse (<20)'
            }, {
                from: 20,
                to: 200,
                name: 'Moderate (2 - 200)'
            }, {
                from: 200,
                name: 'Dense (>200)'
            }]
        },

        series: [{
            data,
            mapData,
            joinBy: ['iso-a2', 'code'],
            name: 'Population density',
            tooltip: {
                valueSuffix: '/km²'
            }
        }]
    });
}

(async () => {
    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/world.topo.json'
    ).then(response => response.json());

    // Load the data from a Google Spreadsheet
    // https://docs.google.com/spreadsheets/d/1eSoQeilFp0HI-qgqr9-oXdCh5G_trQR2HBaWt_U_n78
    Highcharts.data({
        googleAPIKey: 'AIzaSyCQ0Jh8OFRShXam8adBbBcctlbeeA-qJOk',
        googleSpreadsheetKey: '1eSoQeilFp0HI-qgqr9-oXdCh5G_trQR2HBaWt_U_n78',

        // custom handler when the spreadsheet is parsed
        parsed: function (columns) {

            // Read the columns into the data array
            var data = [];
            columns[0].forEach((code, i) => {
                data.push({
                    code: code.toUpperCase(),
                    value: parseFloat(columns[2][i]),
                    name: columns[1][i]
                });
            });

            drawChart(topology, data);
        },

        error: function (html, xhr) {
            const chart = drawChart();
            chart.showLoading('Error loading sample data: ' + xhr.status);
        }
    });
})();

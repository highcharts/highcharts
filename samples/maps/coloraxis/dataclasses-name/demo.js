(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/world.topo.json'
    ).then(response => response.json());

    function drawChart(data) {
        return Highcharts.mapChart('container', {
            chart: {
                borderWidth: 1
            },

            colors: ['rgba(19,64,117,0.1)', 'rgba(19,64,117,0.5)', 'rgba(19,64,117,1)'],

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
                backgroundColor: 'rgba(255,255,255,0.9)',
                symbolRadius: 0,
                symbolHeight: 14
            },

            colorAxis: {
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
                data: data,
                mapData: topology,
                joinBy: ['iso-a2', 'code'],
                name: 'Population density',
                tooltip: {
                    valueSuffix: '/km²'
                }
            }]
        });
    }


    // Load the data from a Google Spreadsheet
    // https://docs.google.com/spreadsheets/d/1eSoQeilFp0HI-qgqr9-oXdCh5G_trQR2HBaWt_U_n78
    Highcharts.data({
        googleAPIKey: 'AIzaSyCQ0Jh8OFRShXam8adBbBcctlbeeA-qJOk',
        googleSpreadsheetKey: '1eSoQeilFp0HI-qgqr9-oXdCh5G_trQR2HBaWt_U_n78',

        // custom handler when the spreadsheet is parsed
        parsed: function (columns) {
            // Read the columns into the data array
            const data = [];
            columns[0].forEach((code, i) => {
                data.push({
                    code: code.toUpperCase(),
                    value: parseFloat(columns[2][i]),
                    name: columns[1][i]
                });
            });

            drawChart(data);
        },

        error: function (html, xhr) {
            const chart = drawChart();
            chart.showLoading('Error loading sample data: ' + xhr.status);
        }
    });
})();
